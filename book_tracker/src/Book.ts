// src/Book.ts
export enum Status {
    Read = "Read",
    ReRead = "Re-read",
    DNF = "DNF",
    CurrentlyReading = "Currently reading",
    ReturnedUnread = "Returned Unread",
    WantToRead = "Want to read"
}

export enum Format {
    Print = "Print",
    PDF = "PDF",
    Ebook = "Ebook",
    AudioBook = "AudioBook"
}

export class Book {
    title: string;
    author: string;
    numberOfPages: number;
    status: Status;
    price: number;
    pagesRead: number;
    format: Format;
    suggestedBy: string;
    finished: boolean;

    constructor(
        title: string,
        author: string,
        numberOfPages: number,
        status: Status,
        price: number,
        pagesRead: number,
        format: Format,
        suggestedBy: string
    ) {
        this.title = title;
        this.author = author;
        this.numberOfPages = numberOfPages;
        this.status = status;
        this.price = price;
        this.pagesRead = pagesRead;
        this.format = format;
        this.suggestedBy = suggestedBy;
        this.finished = pagesRead >= numberOfPages;
    }

    currentlyAt(): number {
        return this.pagesRead;
    }

    deleteBook(): void {
        // Logic to delete the book can be implemented here
    }
}