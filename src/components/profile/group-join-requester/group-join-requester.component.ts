import { Component, computed, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'profile-group-join-requester',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './group-join-requester.component.html',
  styleUrl: './group-join-requester.component.css',
})
export class GroupJoinRequesterComponent {
  protected readonly Array = Array;

  selectedServer = signal(undefined as any);

  requestableGroups = computed(() => {
    let groups = this.userService.groupsAll();
    let f = this.userService
      .groupsAll()
      .filter((e) => !e.users.includes(this.userService.user()._id));
    return f;
  });

  selectedGroup = computed(() => {
    let sId = this.selectedServer()?._id || 0;
    if (!sId) {
      return undefined;
    }
    let a = this.userService.groupsAll().find((e) => e._id === sId);
    return a;
  });

  jj = computed(() => {
    return this.selectedGroup()?.requestedUsers.some(
      (e: any) => e._id === this.userService.user()._id,
    );
  });

  constructor(protected userService: UserService) {
    console.log(this.jj());
  }

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
    const updatedGroup = this.userService
      .groupsAll()
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
