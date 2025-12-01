import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { Link } from '@inertiajs/react';

interface PaginatorLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginatorLink[];
}

export default function Pagination({ links }: PaginationProps) {
    // Jangan render apapun jika hanya ada 'previous' dan 'next' (artinya hanya 1 halaman)
    if (links.length < 3) return null;

    return (
        <div className="mt-4 flex items-center justify-between rounded-b-lg border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:justify-end">
                {/* Tombol Previous */}
                <Link
                    href={links[0].url || '#'}
                    className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${!links[0].url ? 'cursor-not-allowed opacity-50' : ''}`}
                    as="button"
                    disabled={!links[0].url}
                >
                    <ChevronLeftIcon className="mr-2 h-5 w-5" />
                    Previous
                </Link>

                {/* Tombol Next */}
                <Link
                    href={links[links.length - 1].url || '#'}
                    className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${!links[links.length - 1].url ? 'cursor-not-allowed opacity-50' : ''}`}
                    as="button"
                    disabled={!links[links.length - 1].url}
                >
                    Next
                    <ChevronRightIcon className="ml-2 h-5 w-5" />
                </Link>
            </div>
        </div>
    );
}
