import { protectedProcedure, publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Prisma, Session, User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const userRouter = router({
	createUser: publicProcedure
		.input(
			z.object({
				firstName: z.string(),
				lastName: z.string(),
				email: z.string(),
				password: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const salt = bcrypt.genSaltSync(10);
			const hashPassword = bcrypt.hashSync(input.password, salt);

			const user = await ctx.prisma.user
				.create({
					data: {
						id: uuidv4(),
						firstName: input.firstName,
						lastName: input.lastName,
						password: hashPassword,
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

			if (user) {
				const newSession: Session = await ctx.prisma.session.create({
					data: {
						id: uuidv4(),
						userId: user.id,
					},
				});

				const token = jwt.sign(newSession, 'superSecretTestKey', {
					expiresIn: 31556926, // 1 year in seconds TODO: fix this?
				});
				ctx.resHeaders.set(
					'set-cookie',
					`jwt=${token};HttpOnly;Secure;`
				);
			}
			return user;
		}),
	login: publicProcedure
		.input(
			z.object({
				email: z.string(),
				password: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const user = await ctx.prisma.user.findUnique({
				where: {
					email: input.email,
				},
			});
			if (!user) {
				throw new TRPCError({
					message: 'No account exists for this email',
					code: 'BAD_REQUEST',
				});
			}
			if (!bcrypt.compareSync(input.password, user.password)) {
				throw new TRPCError({
					message: 'Incorrect password',
					code: 'BAD_REQUEST',
				});
			}

			const newSession: Session = await ctx.prisma.session.create({
				data: {
					id: uuidv4(),
					userId: user.id,
				},
			});

			const token = jwt.sign(newSession, 'superSecretTestKey', {
				expiresIn: 31556926, // 1 year in seconds TODO: fix this?
			});
			ctx.resHeaders.set('set-cookie', `jwt=${token};HttpOnly;Secure;`);
			return user;
		}),
	isLoggedIn: protectedProcedure.query(() => {
		return true;
	}),
});
