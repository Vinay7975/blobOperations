import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, concatMap, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileUploaderService {
  private apiUrl = 'http://localhost:7071';

  constructor(private https: HttpClient) {}

  getGenerateSasToken(fileName: string): Observable<any> {
    let url = `${this.apiUrl}/api/getSasUrl`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('fileName', fileName);

    const httpOptions = {
      params: queryParams,
    };
    return this.https.get(url, httpOptions);    
  }

  uploadFile(
    file: string,
    sasUrl: string,
    file_content_type: any
  ): Observable<any> {
    const httpOptions = {
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'content-type': file_content_type,
      },
    };
    return this.https.put(sasUrl, file, httpOptions);
  }

  upload(
    fileName: string,
    file: string,
    file_content_type: string
  ) {
    return of(fileName).pipe(
      concatMap((fileName: string) => {
        return this.getGenerateSasToken(`/${fileName}`);
      }),
      concatMap((response: any) => {
        let sasURL = response.blobUrlWithSas;
        return this.uploadFile(file, sasURL, file_content_type);
      })
    );
  }

  getFilesList(): Observable<any> {
    let url = `${this.apiUrl}/api/getListoffiles`;
    return this.https.get(url).pipe(
      tap(data => console.log('Response from getFilesList:', data)),
    );
  }

  deleteBlob(containerName: string, blobName: string): Observable<any> {
    let url = `${this.apiUrl}/api/deleteFile`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('containerName', containerName);
    queryParams = queryParams.append('blobName', blobName);

    const httpOptions = {
      params: queryParams,
    };

    return this.https.delete(url, httpOptions);
  }

downloadFile(blobName: string): Observable<any> {
    let url = `${this.apiUrl}/api/downloadFiles`;
    let queryParams = new HttpParams().set('blobName', blobName.toString());
    const httpOptions = {
      params: queryParams,
      responseType: 'blob' as 'json'
    };
    return this.https.get(url, httpOptions);
}
}
