export class OrderinfoAccount {
  createdAt: string;
  id: number;
  done: boolean;
  total: number;
}

export class OrderInfoRecap {
  "Article.name": string;
  "OrderInfo.date_order": string;
  nombre: string;
  id_article: number;
}

export class OrderInfoRecapClient {
    "User.first_name": string;
    "User.last_name": string;
    done: boolean;
    id: number;
    id_client: number;
  }
