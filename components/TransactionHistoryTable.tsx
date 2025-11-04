import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface Transaction {
  id: string;
  type: "don" | "reçu" | "transfert";
  amount: number;
  date: string;
  status: "confirmé" | "en cours" | "échoué";
  txHash: string;
}

interface TransactionHistoryTableProps {
  transactions: Transaction[];
}

export default function TransactionHistoryTable({ transactions }: TransactionHistoryTableProps) {
  const typeLabels = {
    don: "Don",
    reçu: "Reçu",
    transfert: "Transfert"
  };

  const statusColors = {
    confirmé: "bg-green-500",
    "en cours": "bg-yellow-500",
    échoué: "bg-red-500"
  };

  return (
    <div className="rounded-lg border" data-testid="table-transactions">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id} data-testid={`row-transaction-${tx.id}`}>
              <TableCell className="font-medium">
                {typeLabels[tx.type]}
              </TableCell>
              <TableCell className="font-mono">
                {tx.type === "don" ? "-" : "+"}{tx.amount} ℏ
              </TableCell>
              <TableCell className="text-muted-foreground">
                {tx.date}
              </TableCell>
              <TableCell>
                <Badge className={statusColors[tx.status]}>
                  {tx.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" className="gap-1" data-testid={`button-view-${tx.id}`}>
                  <ExternalLink className="h-3 w-3" />
                  Voir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
