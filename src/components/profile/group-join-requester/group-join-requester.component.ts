import { Component, computed, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '@services/user/user.service';
import { ChatService } from '@services/chat/chat.service';
import { GroupService } from '@services/group/group.service';

@Component({
  selector: 'profile-group-join-requester',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './group-join-requester.component.html',
  styleUrl: './group-join-requester.component.css',
})
export class GroupJoinRequesterComponent {
  protected readonly Array = Array;
  constructor(
    protected chatService: ChatService,
    protected userService: UserService,
    protected groupService: GroupService,
  ) {
    console.log(this.jj());
  }

  selectedServer = signal(undefined as any);

  requestableGroups = computed(() => {
    this.chatService.allGroups();
    return this.chatService
      .allGroups()
      .filter((e) => !e.users.includes(this.userService.user()._id));
  });

  selectedGroup = computed(() => {
    let sId = this.selectedServer()?._id || 0;
    if (!sId) {
      return undefined;
    }
    return this.chatService.allGroups().find((e) => e._id === sId);
  });

  jj = computed(() => {
    return this.selectedGroup()?.requestedUsers.some(
      (e: any) => e._id === this.userService.user()._id,
    );
  });

  selectServer(server: any) {
    // this.selectedServer.set(server);
    this.selectedGroup() === server
      ? this.selectedServer.set(undefined)
      : this.selectedServer.set(server);
    console.log(
      this.selectedGroup().requestedUsers.find(
        (e: any) => e._id === this.userService.user()._id,
      ),
    );
  }

  updateSelectedServer() {
    console.log('Updating');
    console.log(this.selectedServer());
    const updatedGroup = this.chatService
      .allGroups()
      .find((e) => e._id === this.selectedServer()._id);
    if (updatedGroup) {
      console.log('setting new group');
      console.log(updatedGroup);
      // this.selectServer(updatedGroup);
    }
    console.log('Updated');
  }

  userHasRequested(group: any) {
    return group.requestedUsers.some(
      (e: any) => e._id === this.userService.user()._id,
    );
  }
}
