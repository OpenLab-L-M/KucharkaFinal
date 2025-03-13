import { Component, inject } from '@angular/core';
import {FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators} from '@angular/forms';
import { TaskDTO } from '../DTOs/TaskDTO';
import { TaskService } from 'src/services/task.service';
import { buffer, min, Subject, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import Tesseract from 'tesseract.js';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, FormsModule, MatIcon],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent {
taskService = inject(TaskService);
router = inject(Router);
taskCreateForm= new FormGroup({
  priority: new FormControl(null, Validators.required),
  deadLine: new FormControl(null, Validators.required),
  name: new FormControl('', Validators.required),
  description: new FormControl('')
})
 private destroy$ = new Subject<void>();
  public currentDate = Date.now.toString();
submit(){
  console.log(this.taskCreateForm.controls['priority']?.value);
  console.log(this.taskCreateForm.controls['deadLine']?.value);
  console.log(this.taskCreateForm.controls['name']?.value);
  console.log(this.taskCreateForm.controls['description']?.value);
  
  this.taskService.addTask({
    priority: this.taskCreateForm.controls['priority']?.value,
    deadLine: this.taskCreateForm.controls['deadLine']?.value,//.convertToEuropeTime,
    name: this.taskCreateForm.controls['name']?.value,
    description: this.taskCreateForm.controls['description']?.value
  })
  .pipe(takeUntil(this.destroy$))
  .subscribe(() => this.router.navigate(['/taskList']));
}

extractedText: string = '';
  loading: boolean = false;
  searchText = '';
  searchResult = '';
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const imageData = reader.result as string;
        this.performOCR(imageData);
      };

      reader.readAsDataURL(file); // Convert image to Base64 format
    }
  }

  performOCR(imageData: string): void {
    this.loading = true;

    Tesseract.recognize(
      imageData
    )
      .then(({ data: { text } }) => {
        this.extractedText = this.removeAngleBrackets(text);
        this.taskCreateForm.controls['description'].setValue(this.extractedText); // Extracted text
        this.loading = false;
      })
      .catch((err) => {
        console.error('OCR Error:', err);
        this.loading = false;
      });
  }

/*  search() {
    if (this.extractedText.toUpperCase().includes(this.searchText.toUpperCase())) {
      this.searchResult = 'Text "' + this.searchText + '"' + 'exists. Occurences :' + this.countNumberOfOccurences();
    } else {
      this.searchResult = "Not exist"
    }
  }

  countNumberOfOccurences() {
    const regex = new RegExp(this.searchText.toUpperCase(), "g");
    return (this.extractedText.toUpperCase().match(regex) || []).length;    
  }*/

  removeAngleBrackets(text: string): string {
    return text.replace(/[<>]/g, ' '); 
  }
}
