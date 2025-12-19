// Payment Transaction Response Types

export type PaymentTransactionUser = {
	id: string;
	fullName: string;
	phoneNumber: string;
	pointBalance: number;
	creditBalance: number;
	rank: string;
	roles: string[];
	avatarUrl: string;
};

export type PaymentTransactionPackage = {
	packageId: string;
	name: string;
	description: string;
	price: number;
	connectionAmount: number;
	isActive: boolean;
	packageType: string; // e.g. 'Freemium'
};

export type PaymentTransaction = {
	paymentId: string;
	userId: string;
	user: PaymentTransactionUser;
	packageId: string;
	package: PaymentTransactionPackage;
	amount: number;
	paymentGateway: string;
	status: string; // e.g. 'Pending'
	transactionRef: string;
	vnpTransactionNo: string;
	bankCode: string;
	responseCode: string;
	orderInfo: string;
	clientIpAddress: string;
	createdAt: string; // ISO date string
};

import type { PaginatedResponse } from "./common";

export type PaymentTransactionResponse = PaginatedResponse<PaymentTransaction>;
