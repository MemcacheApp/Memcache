import React from 'react';
import styles from './page.module.css';
import { UserCircle2 } from 'lucide-react';

export default function SignUpForm() {
	return (
		<form className={styles['form-container']} action=''>
			<div className={styles['header']}>
				<UserCircle2 size={36} />
				<h1 className={styles['form-title']}>Sign Up</h1>
			</div>
			<div className={styles['name']}>
				<div className={styles['form-field']}>
					<label htmlFor='sign-up-first-name-input'>First name</label>
					<input
						type='text'
						id='sign-up-first-name-input'
						className={styles['input']}
					/>
				</div>
				<div className={styles['form-field']}>
					<label htmlFor='sign-up-last-name-input'>Last name</label>
					<input
						type='text'
						id='sign-up-last-name-input'
						className={styles['input']}
					/>
				</div>
			</div>

			<div className={styles['form-field']}>
				<label htmlFor='sign-up-email-input'>Email</label>
				<input
					type='email'
					id='sign-up-email-input'
					className={styles['input']}
				/>
			</div>
			<div className={styles['form-field']}>
				<label htmlFor='sign-up-password-input'>Password</label>
				<input
					type='password'
					id='sign-up-password-input'
					className={styles['input']}
				/>
			</div>
		</form>
	);
}
