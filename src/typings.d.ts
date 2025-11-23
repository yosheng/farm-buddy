declare namespace API {
    type CurrentUser = {
        name?: string;
        avatar?: string;
        userid?: string;
        email?: string;
        signature?: string;
        title?: string;
        group?: string;
        tags?: { key?: string; label?: string }[];
        notifyCount?: number;
        unreadCount?: number;
        country?: string;
        access?: string;
        geographic?: {
            province?: { label?: string; key?: string };
            city?: { label?: string; key?: string };
        };
        address?: string;
        phone?: string;
    };

    // 分頁篩選參數
    type QuePaging = {
        current?: number; pageSize?: number; sort?: Record<string, 'ascend' | 'descend' | null>
    }

    // 分頁資料結果
    type ResPagination<T> = { items: T[], current: number, pageSize: number, total: number }

    type EnumItem = { label: string, value: string | number, [propName: string]: string | number }

    type ResEnum<T = EnumItem[]> = T

}
