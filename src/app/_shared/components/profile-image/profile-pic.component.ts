import { OnInit, Input, Component } from '@angular/core';
import { AppDataService } from '../../../_services/app.data.service';

@Component({
    selector: 'profile-pic',
    template: `<img
    src="{{UserId}}"
    width="{{ImageSize}}"
    height="{{ImageSize}}"
    onerror="this.src='../../../assets/img/default_user.png'"
    class="avatar_photo"
    alt="Profile Picture">`
})

export class ProfilePictureComponent implements OnInit {

    @Input() public UserId = '';
    @Input() public ImageSize = '';

    constructor(private appData: AppDataService) {
    }

    public ngOnInit() {
        this.UpdateProfilePicture(this.UserId, this.ImageSize);
    }

    public UpdateProfilePicture(userId: string, imageSize: string): void {
        this.UserId = this.appData.getUrl(this.appData.url.userPhoto, [userId]);
        this.ImageSize = (!imageSize) ? '32' : imageSize;
    }
}
