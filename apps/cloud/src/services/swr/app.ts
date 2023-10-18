import { builderRequest } from "@illa-public/illa-net"
import { AppInfoShape, ComponentNode } from "@illa-public/public-types"
import {
  USER_ROLE,
  getCurrentTeamInfo,
  getPlanUtils,
} from "@illa-public/user-data"
import {
  ACTION_ACCESS,
  ATTRIBUTE_GROUP,
  canAccess,
} from "@illa-public/user-role-utils"
import { useSelector } from "react-redux"
import useSWR from "swr"

export const useAppList = () => {
  const currentTeamInfo = useSelector(getCurrentTeamInfo)
  const canAccessApps = canAccess(
    currentTeamInfo?.myRole ?? USER_ROLE.VIEWER,
    ATTRIBUTE_GROUP.APP,
    getPlanUtils(currentTeamInfo),
    ACTION_ACCESS.VIEW,
  )

  return useSWR(
    ["/apps", currentTeamInfo?.id, canAccessApps],
    ([url, teamID]) =>
      canAccessApps
        ? builderRequest<AppInfoShape[]>(
            {
              url,
              method: "GET",
            },
            { teamID },
          ).then((res) => res.data)
        : [],
  )
}

export const fetchDeleteApp = (appID: string, teamID: string) => {
  return builderRequest<{ appID: string }>(
    {
      url: `/apps/${appID}`,
      method: "DELETE",
    },
    { teamID },
  )
}

export const fetchCopyApp = (appID: string, name: string, teamID: string) => {
  return builderRequest<AppInfoShape>(
    {
      url: `/apps/${appID}/duplication`,
      method: "POST",
      data: {
        appName: name,
      },
    },
    {
      teamID,
    },
  ).then((res) => res.data)
}

export const fetchUpdateAppConfig = async (
  appID: string,
  teamID: string,
  config: {
    public?: boolean
    waterMark?: boolean
    description?: string
    appName?: string
  },
) => {
  return builderRequest<AppInfoShape>(
    {
      method: "PATCH",
      url: `/apps/${appID}/config`,
      data: config,
    },
    {
      teamID,
    },
  ).then((res) => res.data)
}

interface IAppCreateRequestData {
  appName: string
  initScheme: ComponentNode
}

export const fetchCreateApp = (data: IAppCreateRequestData, teamID: string) => {
  return builderRequest<AppInfoShape>(
    {
      url: "/apps",
      method: "POST",
      data,
    },
    { teamID },
  )
}