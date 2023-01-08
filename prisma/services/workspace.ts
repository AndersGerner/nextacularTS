import { InvitationStatus, TeamRole } from '@prisma/client'
import slugify from 'slugify'

import {
  html as inviteHtml,
  text as inviteText,
} from '../../src/config/email-templates/invitation'
import {
  html as createHtml,
  text as createText,
} from '../../src/config/email-templates/workspace-create'
import { sendMail } from '../../src/lib/server/mail'
import prisma from '../index'

export const countWorkspaces = async (slug: string) =>
  await prisma.workspace.count({
    where: { slug: { startsWith: slug } },
  })

export const createWorkspace = async (
  creatorId: string,
  email: string,
  name: string,
  slug: string
) => {
  const count = await countWorkspaces(slug)

  if (count > 0) {
    slug = `${slug}-${count}`
  }

  const workspace = await prisma.workspace.create({
    data: {
      creatorId,
      members: {
        connectOrCreate: {
          where: { email },
          create: {
            email,
            inviter: email,
            status: InvitationStatus.ACCEPTED,
            teamRole: TeamRole.OWNER,
          },
        },
      },
      name,
      slug,
    },
  })
  await sendMail({
    html: createHtml({ code: workspace.inviteCode, name }),
    subject: `[Nextacular] Workspace created: ${name}`,
    text: createText({ code: workspace.inviteCode, name }),
    from: process.env.EMAIL_FROM,
    to: email,
  })
}

export const deleteWorkspace = async (
  id: string,
  email: string,
  slug: string
) => {
  const workspace = await getOwnWorkspace(id, email, slug)

  if (workspace) {
    await prisma.workspace.update({
      data: { deletedAt: new Date() },
      where: { id: workspace.id },
    })
    return slug
  } else {
    throw new Error('Unable to find workspace')
  }
}

export const getInvitation = async (inviteCode: string) =>
  await prisma.workspace.findFirst({
    select: {
      id: true,
      name: true,
      workspaceCode: true,
      slug: true,
    },
    where: {
      deletedAt: null,
      inviteCode,
    },
  })

export const getOwnWorkspace = async (
  id: string,
  email: string,
  slug: string
) =>
  await prisma.workspace.findFirst({
    select: {
      id: true,
      inviteCode: true,
      name: true,
    },
    where: {
      OR: [
        { id },
        {
          members: {
            some: {
              deletedAt: null,
              teamRole: TeamRole.OWNER,
              email,
            },
          },
        },
      ],
      AND: {
        deletedAt: null,
        slug,
      },
    },
  })

export const getSiteWorkspace = async (slug: string, customDomain) =>
  await prisma.workspace.findFirst({
    select: {
      id: true,
      name: true,
      slug: true,
      domains: { select: { name: true } },
    },
    where: {
      OR: [
        { slug },
        customDomain
          ? {
              domains: {
                some: {
                  name: slug,
                  deletedAt: null,
                },
              },
            }
          : undefined,
      ],
      AND: { deletedAt: null },
    },
  })

export const getWorkspace = async (id: string, email: string, slug: string) =>
  await prisma.workspace.findFirst({
    select: {
      creatorId: true,
      name: true,
      inviteCode: true,
      slug: true,
      workspaceCode: true,
      creator: { select: { email: true } },
      members: {
        select: {
          email: true,
          teamRole: true,
        },
      },
    },
    where: {
      OR: [
        { id },
        {
          members: {
            some: {
              email,
              deletedAt: null,
            },
          },
        },
      ],
      AND: {
        deletedAt: null,
        slug,
      },
    },
  })

export const getWorkspaces = async (id: string, email: string) =>
  await prisma.workspace.findMany({
    select: {
      createdAt: true,
      creator: {
        select: {
          email: true,
          name: true,
        },
      },
      inviteCode: true,
      members: {
        select: {
          member: {
            select: {
              email: true,
              image: true,
              name: true,
            },
          },
          joinedAt: true,
          status: true,
          teamRole: true,
        },
      },
      name: true,
      slug: true,
      workspaceCode: true,
    },
    where: {
      OR: [
        { id },
        {
          members: {
            every: {
              email,
              deletedAt: null,
              status: InvitationStatus.ACCEPTED,
            },
          },
        },
      ],
      AND: { deletedAt: null },
    },
  })

export const getWorkspacePaths = async () => {
  const [workspaces, domains] = await Promise.all([
    prisma.workspace.findMany({
      select: { slug: true },
      where: { deletedAt: null },
    }),
    prisma.domain.findMany({
      select: { name: true },
      where: { deletedAt: null },
    }),
  ])
  return [
    ...workspaces.map((workspace) => ({
      params: { site: workspace.slug },
    })),
    ...domains.map((domain) => ({
      params: { site: domain.name },
    })),
  ]
}

export const inviteUsers = async (
  id: string,
  email: string,
  members,
  slug: string
) => {
  const workspace = await getOwnWorkspace(id, email, slug)
  const inviter = email

  if (workspace) {
    const membersList = members.map(({ email, role }) => ({
      email,
      inviter,
      teamRole: role,
    }))
    const data = members.map(({ email }) => ({
      createdAt: null,
      email,
    }))
    await Promise.all([
      prisma.user.createMany({
        data,
        skipDuplicates: true,
      }),
      prisma.workspace.update({
        data: {
          members: {
            createMany: {
              data: membersList,
              skipDuplicates: true,
            },
          },
        },
        where: { id: workspace.id },
      }),
      sendMail({
        html: inviteHtml({ code: workspace.inviteCode, name: workspace.name }),
        subject: `[Nextacular] You have been invited to join ${workspace.name} workspace`,
        text: inviteText({ code: workspace.inviteCode, name: workspace.name }),
        from: process.env.EMAIL_FROM,
        to: members.map((member) => member.email),
      }),
    ])
    return membersList
  } else {
    throw new Error('Unable to find workspace')
  }
}

export const isWorkspaceCreator = (id: string, creatorId: string) =>
  id === creatorId

export const isWorkspaceOwner = (email: string, workspace) => {
  let isTeamOwner = false
  const member = workspace.members.find(
    (member) => member.email === email && member.teamRole === TeamRole.OWNER
  )

  if (member) {
    isTeamOwner = true
  }

  return isTeamOwner
}

export const joinWorkspace = async (workspaceCode: string, email: string) => {
  const workspace = await prisma.workspace.findFirst({
    select: {
      creatorId: true,
      id: true,
    },
    where: {
      deletedAt: null,
      workspaceCode,
    },
  })

  if (workspace) {
    await prisma.member.upsert({
      create: {
        workspaceId: workspace.id,
        email,
        inviter: workspace.creatorId,
        status: InvitationStatus.ACCEPTED,
      },
      update: {},
      where: { email },
    })
    return new Date()
  } else {
    throw new Error('Unable to find workspace')
  }
}

export const updateName = async (
  id: string,
  email: string,
  name: string,
  slug: string
) => {
  const workspace = await getOwnWorkspace(id, email, slug)

  if (workspace) {
    await prisma.workspace.update({
      data: { name },
      where: { id: workspace.id },
    })
    return name
  } else {
    throw new Error('Unable to find workspace')
  }
}

export const updateSlug = async (
  id: string,
  email: string,
  newSlug: string,
  pathSlug: string
) => {
  let slug = slugify(newSlug.toLowerCase())
  const count = await countWorkspaces(slug)

  if (count > 0) {
    slug = `${slug}-${count}`
  }

  const workspace = await getOwnWorkspace(id, email, pathSlug)

  if (workspace) {
    await prisma.workspace.update({
      data: { slug },
      where: { id: workspace.id },
    })
    return slug
  } else {
    throw new Error('Unable to find workspace')
  }
}
