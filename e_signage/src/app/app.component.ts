import { Component } from '@angular/core';
import { FileUploaderService } from './file-uploader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selectedFile: any = null;
  fileName: string = '';
  fileSize: number = 0;
  fileType: string = '';
  fileUploadProgress: string = '0.00';
  sasTokenUrl: string = '';
  fileData: string = '';
  success_msg: string = '';
  files: any;

  constructor(private fileUploadService: FileUploaderService) { }

  ngOnInit() {
    this.getListOfFiles();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.setFileDetails();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
      this.setFileDetails();
    }
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
  }

  openFileInput(): void {
    const fileInput = document.getElementById('file');
    if (fileInput) {
      fileInput.click();
    }
  }

  setFileDetails(): void {
    this.fileName = this.selectedFile.name;
    this.fileSize = this.selectedFile.size;
    this.fileType = this.selectedFile.type;
  }

  onGenerateSasToken() {
    if (this.selectedFile) {
      this.fileUploadService.getGenerateSasToken(this.fileName).subscribe({
        next: (res) => {
          console.log(`res ---`, JSON.stringify(res));
          this.sasTokenUrl = res.blobUrlWithSas;
        }
      });
    } else {
      window.alert(`Please select the file`);
    }
  };

  onUpload() {
    if (this.selectedFile) {
      this.fileUploadService.upload(this.fileName, this.selectedFile, this.fileType).subscribe({
        next: () => {
          console.log(`File upload successfully`);
          this.success_msg = this.fileName;
          this.selectedFile = "";
          this.sasTokenUrl = "";
          this.getListOfFiles(); // Refresh the list of files after upload
        },
        error: (error) => {
          console.log('Failed to upload the file');
        }
      });
    } else {
      window.alert(`Please select the file`);
    }
  };

  getListOfFiles() {
    this.fileUploadService.getFilesList().subscribe({
      next: (response) => {
        this.files = response.files;
        console.log('List of files:', this.files);
      },
      error: (error) => {
        console.error('Error fetching files:', error);
      }
    });
  }

  onDeleteFile(blobName: any): void {
    let actualBlobName: string;
  
    if (typeof blobName === 'object' && blobName !== null && blobName.hasOwnProperty('name')) {
      actualBlobName = blobName.name;
    } else {
      console.error('Invalid blob name format:', blobName);
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${actualBlobName}?`)) {
      this.fileUploadService.deleteBlob('esignage', actualBlobName).subscribe({
        next: (response) => {
          console.log(`Blob "${actualBlobName}" deleted successfully.`);
          this.files = response.files
          this.getListOfFiles(); 
        },
        error: (error) => {
          console.error(`Error deleting blob "${actualBlobName}":`, error);
        }
      });
    }
  }
  
  
  onDownloadFile(blobName: string): void {
    this.fileUploadService.downloadFile(blobName).subscribe({
        next: (data: Blob) => {
            const downloadUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = blobName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);
        },
        error: (error) => {
            console.error('Error downloading file:', error);
        }
    });
}

}
