import { Injectable } from '@nestjs/common';
import { PrismaService } from './../../src/prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: { userID: userId },
    });
  }

  getBookmarkById(userId: number, bookmarkId: number) {}

  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userID: userId,
        ...dto,
      },
    });
    console.log(bookmark);

    return bookmark;
  }

  editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto) {}

  deleteBookmarkById(userId: number, bookmarkId: number) {}
}
