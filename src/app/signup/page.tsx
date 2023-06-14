import React from 'react';
import styles from './page.module.css';
import SignUpForm from './SignUpForm';

export default function page() {
	return (
		<div className={styles['page-container']}>
			<SignUpForm />
		</div>
	);
}
