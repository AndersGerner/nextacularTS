import { createContext, useContext, useState } from 'react'
import type { Workspace } from '@prisma/client'

type WorkspaceContextState = {
  workspace: Workspace
}

type WorkspaceContextActions = {
  setWorkspace: (workspace: Workspace) => void
}

const initialState: WorkspaceContextState & WorkspaceContextActions = {
  setWorkspace: () => Promise.resolve(),
  workspace: null,
}

const WorkspaceContext = createContext(initialState)

export const useWorkspace = () => useContext(WorkspaceContext)

const WorkspaceProvider = ({ children }) => {
  const [workspace, setWorkspaceState] = useState<Workspace>(null)

  const setWorkspace = (workspace: Workspace) => {
    setWorkspaceState(workspace)
  }

  return (
    <WorkspaceContext.Provider value={{ setWorkspace, workspace }}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export default WorkspaceProvider
