import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';

export const userRouter = router({
	createUser: publicProcedure
		.input(
			z.object({
				firstName: z
					.string()
					.min(1, { message: 'First name is required' }),
				lastName: z
					.string()
					.min(1, { message: 'Last name is required' }),
				email: z
					.string()
					.min(1, { message: 'Email is required' })
					.email({
						message: 'Must be a valid email',
					}),
				password: z.string().min(6, {
					message: 'Password must be at least 6 characters',
				}),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const user = await ctx.prisma.user
				.create({
					data: {
						id: uuidv4(),
						firstName: input.firstName,
						lastName: input.lastName,
						password: input.password,
						email: input.email,
					},
				})
				.catch((e) => {
					if (e instanceof Prisma.PrismaClientKnownRequestError) {
						if (e.code === 'P2002') {
							throw new TRPCError({
								message: 'Email is already registered',
								code: 'BAD_REQUEST',
							});
						}
					}
				});

			return user;
		}),
	deleteUser: publicProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const item = await ctx.prisma.item.delete({
				where: {
					id: input.id,
				},
			});

			return item;
		}),
	updateUser: publicProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const item = await ctx.prisma.item.delete({
				where: {
					id: input.id,
				},
			});

			return item;
		}),
});
