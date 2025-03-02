import {Component, computed, effect, signal, Inject, Output, inject} from '@angular/core';
import { UserService } from 'src/services/user.service';
import { UserDTO } from './UserDTO';
import { DecimalPipe, NgIf } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgFor } from '@angular/common';
import { NgModel, RequiredValidator, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { RecipesService } from 'src/services/recipes.service';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { MatIconAnchor } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RecipesDTO } from '../recipes/RecipesDTO';
import { MatTableDataSource } from '@angular/material/table';
import {forkJoin, Subject, take, takeUntil} from 'rxjs';
import { MatTooltip } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldControl } from '@angular/material/form-field';
import {ImageDTO} from "../recipes/ImageDTO";
import {CreatorDTO} from "../recipes/CreatorDTO";
import { RecensionsDTO } from '../recipes-details/recensions-dto';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { getBaseUrl } from 'src/main';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [NgFor,
    NgIf, MatIconModule, MatIconAnchor, MatButtonModule, MatCardModule, RouterLink, MatDialogClose, MatFormField, MatTooltip, ReactiveFormsModule, MatLabel, DecimalPipe],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

  changePassword = new FormGroup({
    oldPassword: new FormControl(''),
    newPassword: new FormControl('', Validators.required),
    confirm: new FormControl('', Validators.required),
  });
 // ourListOfRecipes = signal<RecipesDTO[]>([]);
  ourListOfRecipes: RecipesDTO[] = [];

 // ourFavRecipes = signal<RecipesDTO[]>([]);
  ourFavRecipes = signal<RecipesDTO[]>([]);

//  user = signal<UserDTO>(undefined);
  user: UserDTO;
// mine Written Comments
  clicked = false;
  public recensions: RecensionsDTO[] = [];
  imageUploaded = false;
  private destroy$ = new Subject<void>();
  currentUserUsername: string;
  animal: string;
  newPassword: string;
  confirm: string;
  public userName = this.route.snapshot.paramMap.get('userName');
  zobrazKomenty: boolean;
  zobrazRecepty: boolean;

  name: string;

  constructor(private userService: UserService, private recipesSevice: RecipesService, private httpClient: HttpClient, public dialog: MatDialog, private route: ActivatedRoute){}

  cancel(){
    this.clicked = false;
  }
  submit(){
    
    this.newPassword = this.changePassword.controls["newPassword"].value;
    this.confirm = this.changePassword.controls["confirm"].value;
    if(this.newPassword == this.confirm && this.confirm != ''){
    this.userService.changePassword({
      oldPassword: this.changePassword.controls["oldPassword"].value,
      newPassword: this.changePassword.controls["newPassword"].value,
      confirm: this.changePassword.controls["confirm"].value,
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe();
    this.clicked = false;
    alert("you have successfully changed your password!")
  }
  else{
    alert("Either your new password doesnt match the confirm password, or you didnt fill out the boxes");
  }
  }
  ktoryRecept(id: number): void{
    
    const checkbox = document.getElementById('favourite') as HTMLInputElement;
   
    
      this.recipesSevice.addToFav(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if(result != null){
          const isChecked = (event.target as HTMLInputElement).checked
          this.ourFavRecipes.update(res => [...res, result] )
        }
        else{
          const isChecked = (event.target as HTMLInputElement).checked =false;
          this.ourFavRecipes.update(res => res.filter(fav => fav.id !== id))
          
        }
      });
    }
    
    chPasswordClicked(){
      this.clicked = true;
    }
     
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });

    dialogRef.componentInstance.imageDeleted.subscribe(() => {
      //this.user.update(user => ({...user, pictureURL: undefined}));
      this.user.pictureURL = undefined;
    });
  }
  recipeService = inject(RecipesService);
  imageDTO: ImageDTO[] = [];

  userImages: CreatorDTO[] = [];
  ngOnInit(): void{
    this.userService.getCurrentUser()
    .pipe(takeUntil(this.destroy$))
    .subscribe(result => this.currentUserUsername = result.userName);
    forkJoin({
      currentUser: this.userService.userProfile(this.userName),
      myComments: this.userService.getUsersRecensions(this.userName),
      usersRecipes: this.userService.usersRecipes(this.userName).pipe(takeUntil(this.destroy$)),
      favourites: this.userService.getFavourites().pipe(takeUntil(this.destroy$)),
      allImages: this.recipeService.getAllImages(),
      userCreators: this.userService.getAllCreatorImages()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.user = result.currentUser;
        this.recensions = result.myComments;
        if(this.recensions)
        {
          this.zobrazKomenty = true;
        }
        
        this.ourListOfRecipes = result.usersRecipes;
        this.ourFavRecipes.set(result.favourites);
        this.imageDTO = result.allImages;
        this.userImages = result.userCreators;
        this.comprim();
        this.getImageSrc(this.user.pictureURL); // Assuming this is a method that sets the image source
      });
  }

  comprim() {
    this.ourFavRecipes().forEach(a =>
      a.comprimedImage = `data:image/jpeg;base64,${this.userImages.find(b => b.id === a.userID).pictureURL}`,
    )
  }
  public getImageSrc(imageData: string): string {
    return `data:image/jpeg;base64,${imageData}`;
  }
  public getImage(id: number, ) {
    return `data:image/jpeg;base64,${this.imageDTO.find(image => image.id === id).image}`;
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',
  styleUrl: 'dialog-content-example-dialog.scss',
  standalone: true,
  imports: [MatDialogClose, NgIf, MatFormField, MatButtonModule, MatInputModule, MatFormFieldModule],
})
export class DialogOverviewExampleDialog {
  imageDTO: ImageDTO[] = [];

  @Output() imageDeleted = new EventEmitter<void>();
  
  user = signal<UserDTO>(undefined);
  imageUploaded = false;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: UserDTO, private userService: UserService, private httpClient: HttpClient,private route: ActivatedRoute) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  recipeService = inject(RecipesService);
   
  userName = this.route.snapshot.paramMap.get('userName');
  ngOnInit(): void{
    this.userService.getCurrentUser()
   .subscribe(result => this.user.set(result));

   this.getImageSrc(this.user().pictureURL);


  }

  deleteImage(): void {
    this.userService.deleteImage().subscribe(
      () => {
        console.log('Image deleted successfully.');
        this.user.update(user => ({...user, pictureURL: undefined}));
        this.imageDeleted.emit();
        // window.location.reload();
      },
      (error) => {
        console.error('Error deleting image:', error);
      }
    );
  }
  private destroy$ = new Subject<void>();
  uploadedImage: File;
  dbImage: any;
  postResponse: any;
  successResponse: string;
  image: any;

  public onImageUpload(event) {
    this.uploadedImage = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.liveDemo = e.target.result;
    }
    reader.readAsDataURL(event.target.files[0]);
  }

  liveDemo:any;



  imageUploadAction() {
    const imageFormData = new FormData();
    imageFormData.append('image', this.uploadedImage, this.uploadedImage.name);
    //'https://localhost:7186/user/upload'
    var base_URL = getBaseUrl();
    this.httpClient.post(base_URL + '/user/upload', imageFormData, { observe: 'response' })
      .subscribe((response) => {
        if (response.status === 200) {
          this.postResponse = response;
          this.successResponse = this.postResponse.body.message;
          this.imageUploaded = true;
          window.location.reload();
        } else {
          this.successResponse = 'Image not uploaded due to some error!';
        }
      }
      );
    }

    public getImageSrc(imageData: string): string {
      return `data:image/jpeg;base64,${imageData}`;
    }
}
