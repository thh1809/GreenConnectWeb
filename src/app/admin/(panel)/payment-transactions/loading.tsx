import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const PAGE_SIZE = 10;

export default function Loading() {
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Lịch sử giao dịch thanh toán</h1>
			<div className="overflow-x-auto bg-card rounded-lg shadow border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>Người dùng</TableHead>
							<TableHead>Gói</TableHead>
							<TableHead>Số tiền</TableHead>
							<TableHead>Trạng thái</TableHead>
							<TableHead>Thời gian</TableHead>
							<TableHead>Hành động</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.from({ length: PAGE_SIZE }).map((_, i) => (
							<TableRow key={i}>
								<TableCell><Skeleton className="h-4 w-16" /></TableCell>
								<TableCell><Skeleton className="h-4 w-32" /></TableCell>
								<TableCell><Skeleton className="h-4 w-24" /></TableCell>
								<TableCell><Skeleton className="h-4 w-20" /></TableCell>
								<TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
								<TableCell><Skeleton className="h-4 w-28" /></TableCell>
								<TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
