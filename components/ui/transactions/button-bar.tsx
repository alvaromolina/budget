"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import { PlusCircledIcon } from "@radix-ui/react-icons"
import { Dialog, DialogTrigger, DialogHeader, DialogFooter, DialogContent, DialogClose, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useDropzone } from 'react-dropzone';
import { useState } from "react"


export function ButtonBar({
    accountId}: {
    accountId: String;}) {

    const [file, setFile] = useState<File | null>(null);


    const handleFileChange = (acceptedFiles: File[]) => {
        setFile(acceptedFiles[0]);
      };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log(file)

        if (!file) {
            alert('Please provide a file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`/api/upload?accountId=${accountId}`, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        if (response.ok && result.success) {
            alert('File uploaded successfully!');
        } else {
            alert(`Error: ${result.error ? result.error : 'Failed to upload file'}`);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleFileChange,
        accept: {
          'application/vnd.ms-excel': ['.xls'],
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        },
      });


  return (
    <div className="flex float-right space-x-2">


        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusCircledIcon  className="mr-2 h-4 w-4" />
                    Import transactions
                </Button>      
                </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                <DialogTitle>Share link</DialogTitle>
                <DialogDescription>
                    Anyone who has this link will be able to view this.
                </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <form onSubmit={handleSubmit}>
                        <div
                        {...getRootProps()}
                        className={`dropzone ${isDragActive ? 'active' : ''}`}
                        >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <p>Drop the file here...</p>
                        ) : (
                            <p>Drag n drop a file here, or click to select a file</p>
                        )}
                        </div>
                        <aside>
                            <h4>Files</h4>
                            <p>{file ? file.name : ''}</p>
                        </aside>
                        <Button type="submit" variant="outline">
                            Upload
                        </Button>  
                    </form>

                </div>
            </DialogContent>
        </Dialog>



        <style jsx>{`
        .dropzone {
          border: 2px dashed #cccccc;
          border-radius: 4px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: border 0.3s ease-in-out;
        }
        .dropzone.active {
          border-color: #00aaff;
        }
      `}</style>

        <Link
        href={`/app/accounts/${accountId}/transactions/new`}>
            <Button>
                <PlusCircledIcon className="mr-2 h-4 w-4" />
                Añadir Transacción
            </Button>
        </Link>
    </div>
  )
}
