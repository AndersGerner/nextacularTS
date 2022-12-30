import Link from 'next/link'
import { useState } from 'react'

import { Bars3Icon } from '@heroicons/react/24/outline'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import sidebarMenu from '../../config/menu/sidebar-static'
import useWorkspaces from '../../hooks/data/useWorkspaces'
import { useWorkspace } from '../../providers/workspace'

import Menu from './menu'
import Actions from './actions'

const staticMenu = sidebarMenu()

const Sidebar = ({ menu }) => {
  const [showMenu, setMenuVisibility] = useState(false)
  const { data, isLoading } = useWorkspaces()
  const { workspace } = useWorkspace()
  const { theme } = useTheme()
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const logo = require('../../../public/images/logo.png')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const logoDark = require('../../../public/images/logo-dark.png')

  const renderMenu = () => {
    return (
      workspace &&
      menu.map((item, index) => (
        <Menu
          key={index}
          data={item}
          isLoading={isLoading}
          showMenu={data?.workspaces.length > 0 || isLoading}
        />
      ))
    )
  }

  const renderStaticMenu = () => {
    return staticMenu.map((item, index) => (
      <Menu key={index} data={item} showMenu={true} />
    ))
  }

  const toggleMenu = () => setMenuVisibility(!showMenu)

  return (
    <aside className="sticky z-40 flex flex-col space-y-5 text-white bg-white dark:bg-black md:overflow-y-auto md:w-1/5 md:h-screen overscroll-contain">
      <div className="relative flexflex-start p-5">
        <Link href="/">
          <Image
            src={theme === 'dark' ? logoDark : logo}
            alt=""
            height={50}
            width={140}
          />
        </Link>

        <button className="absolute right-0 p-5 md:hidden" onClick={toggleMenu}>
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>
      <div
        className={[
          'flex-col space-y-5 md:flex md:relative md:top-0',
          showMenu
            ? 'absolute top-12 bg-gray-800 dark:bg-neutral-900 right-0 left-0 h-screen'
            : 'hidden',
        ].join(' ')}
      >
        <Actions />
        <div className="flex flex-col p-5 space-y-10">
          {renderMenu()}
          {renderStaticMenu()}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
