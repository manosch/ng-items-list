import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { CharDTO } from '../../../api/models/response-dto';
import { MatSelectModule } from '@angular/material/select';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-edit-character',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatFormField, MatLabel, MatSelectModule, MatInput, MatButton, ReactiveFormsModule],
  templateUrl: './edit-character.html',
  styleUrl: './edit-character.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditCharacter {
  readonly dialogRef = inject(MatDialogRef<EditCharacter>);
  readonly data = inject<CharDTO>(MAT_DIALOG_DATA);
  readonly fb = inject(FormBuilder);

  characterForm = this.fb.group({
    name: [this.data.name, Validators.required],
    status: [this.data.status],
    species: [this.data.species],
    gender: [this.data.gender],
  });

  onCancel(): void {
    this.dialogRef.close();
  }
}
