import { PaymentTransactionStatus } from "@/lib/enum/payment-transaction-enum";

/**
 * Parse payment transaction status to human-readable string
 */
export function parsePaymentTransactionStatus(status: PaymentTransactionStatus | string): string {
	switch (status) {
		case PaymentTransactionStatus.Success:
			return "Thành công";
		case PaymentTransactionStatus.Failed:
			return "Thất bại";
		case PaymentTransactionStatus.Pending:
			return "Đang xử lý";
		default:
			return "Không xác định";
	}
}
