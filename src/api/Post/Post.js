import { prisma } from '../../prisma/generated/prisma-client'

export default {
  Post: {
    user: parent => {
      return prisma.post({ id: parent.id }).user()
    },
    comments: parent => {
      return prisma.post({ id: parent.id }).comments()
    },
    likes: parent => {
      return prisma.post({ id: parent.id }).likes()
    },
    likeCounts: parent => {
      return prisma
        .likesConnection({ where: { post: { id: parent.id } } })
        .aggregate()
        .count()
    },
    files: parent => {
      return prisma.post({ id: parent.id }).files()
    },
    // AUTH REQUIRED
    isLiked: (parent, args, { userId, isAuthenticated }) => {
      isAuthenticated(userId)

      return prisma.$exists.post({
        AND: [
          {
            id: parent.id
          },
          {
            likes_some: {
              user: {
                id: userId
              }
            }
          }
        ]
      })
    }
  }
}