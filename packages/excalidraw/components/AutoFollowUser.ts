import { ActionManager } from "../actions/manager";
import { SocketId } from "../types";
import { GoToCollaboratorComponentProps } from "./UserList";

export const AutoFollowUser = (
  uniqueCollaboratorsArray: any[],
  userRole: string,
  actionManager: ActionManager,
  userToFollow: SocketId | null
) => {
    console.log("userRole: ", userRole);
    
  if (uniqueCollaboratorsArray.length == 0 || userRole === "Teacher") {
    return null;
  }

  let lST = null;

  for (let i = uniqueCollaboratorsArray.length - 1; i >= 0; i--) {
    let collaborator = uniqueCollaboratorsArray[i];

    if (collaborator.username === "Teacher") {
      lST = collaborator;
      break;
    }
  }

  if (lST !== null) {
    console.log("Last teacher found, implying Its Student.");

    const data: GoToCollaboratorComponentProps = {
      socketId: lST.socketId,
      collaborator: lST,
      withName: true,
      isBeingFollowed: lST.socketId === userToFollow,
    };
    actionManager.executeAction(
      actionManager.actions.goToCollaborator,
      "api",
      data,
    );
  }
};
