'use client';

import Books from '@/components/Books';
import EmbedPdf from '@/components/EmbedPdf';
import Lab from '@/components/Lab';
import Notes from '@/components/Notes';
import PracticalFiles from '@/components/PracticalFiles';
import Pyqs from '@/components/Pyqs';
import SubjectNav from '@/components/SubjectNav';
import Theory from '@/components/Theory';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { branchList, semesterList, server } from '@/config';
import { usePrevious } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import _ from 'lodash';
import { ChevronRight, Loader2 } from 'lucide-react';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { useParams } from 'next/navigation';
import { FC, useState } from 'react';

export const dynamic = 'force-dynamic';

interface pageProps {}

const Page: FC<pageProps> = ({}) => {
    const [tab, setTab] = useState<string>('theory');
    const previousTab = usePrevious(tab);
    const [embed, setEmbed] = useState<Embed>({ embedLink: '', name: '' });

    const params = useParams();

    const { semester, branch, subject }: Params = params;

    const { data, isLoading, error } = useQuery({
        queryKey: ['subject', semester, branch, subject],
        queryFn: async () => {
            const response = (await axios.get(
                `${server}${
                    semesterList.find((s) => semester === s.label)?.value
                }/${
                    branchList.find((b) => branch === b.label)?.value
                }/${_.startCase(_.toLower(subject))}`
            )) as AxiosResponse;
            return response.data;
        },
    });

    if (error instanceof AxiosError)
        return (
            <div className="p-4 bg-neutral-900 rounded-lg grid place-content-center text-center">
                <h1 className="text-3xl">404 Not Found</h1>
                <p>{error.message}</p>
            </div>
        );

    return (
        <>
            <SubjectNav tab={tab} previousTab={previousTab} setTab={setTab} />
            <div className="grid px-4 sm:px-10 text-neutral-50 lg:px-44 xl:px-60 gap-2 w-full mt-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {isLoading && (
                    <Skeleton className="w-56 h-10 mx-auto rounded-lg sm:col-span-2 md:col-span-3 lg:col-span-4" />
                )}
                <h1 className="text-2xl lg:text-3xl text-center sm:col-span-2 md:col-span-3 lg:col-span-4">
                    {data && data[0].subject}
                </h1>
                <div className="flex px-0.5 sm:px-0 gap-2 sm:col-span-2 md:col-span-3 lg:col-span-4">
                    <h2 className="text-sm flex items-center gap-2">
                        <Badge
                            variant="secondary"
                            className="flex items-center gap-2 text-md text-neutral-400"
                        >
                            {
                                semesterList.find((s) => semester === s.label)
                                    ?.label
                            }
                            <ChevronRight className="h-4 w-4" />
                            {branchList.find((b) => branch === b.label)?.label}
                        </Badge>{' '}
                    </h2>
                </div>
                {isLoading && (
                    <Loader2 className="h-24 w-24 animate-spin mt-5 mx-auto sm:col-span-2 md:col-span-3 lg:col-span-4" />
                )}
                {data && (
                    <>
                        <div className="p-2 sm:col-span-2 md:col-span-3 lg:col-span-4 lg:mt-5 grid gap-2 bg-neutral-900/80 text-neutral-50 rounded-lg">
                            <div className="p-2 bg-neutral-800/80 rounded-lg">
                                <p className="flex text-sm lg:text-base items-center justify-between">
                                    Theory Code{' '}
                                    <span>
                                        {data[0].theorypapercode
                                            ? data[0].theorypapercode
                                            : 'N/A'}
                                    </span>
                                </p>
                                <p className="flex text-sm lg:text-base items-center justify-between">
                                    Theory Credits{' '}
                                    <span>
                                        {data[0].theorycredits
                                            ? data[0].theorycredits
                                            : 'N/A'}
                                    </span>
                                </p>
                                <p className="flex text-sm lg:text-base items-center justify-between">
                                    Lab Code{' '}
                                    <span>
                                        {data[0].labpapercode
                                            ? data[0].labpapercode
                                            : 'N/A'}
                                    </span>
                                </p>
                                <p className="flex text-sm lg:text-base items-center justify-between">
                                    Lab Credits{' '}
                                    <span>
                                        {data[0].labcredits
                                            ? data[0].labcredits
                                            : 'N/A'}
                                    </span>
                                </p>
                            </div>
                            {tab === 'theory' && (
                                <Theory theory={data[0].theory} />
                            )}
                            {tab === 'lab' && <Lab lab={data[0].lab} />}
                            {tab === 'notes' && (
                                <Notes
                                    setEmbed={setEmbed}
                                    setTab={setTab}
                                    note={data[0].camel}
                                />
                            )}
                            {tab === 'pyqs' && (
                                <Pyqs
                                    setEmbed={setEmbed}
                                    setTab={setTab}
                                    pyq={data[0].pYq}
                                />
                            )}
                            {tab === 'books' && (
                                <Books
                                    setEmbed={setEmbed}
                                    setTab={setTab}
                                    book={data[0].book}
                                />
                            )}
                            {tab === 'practical files' && (
                                <PracticalFiles
                                    setEmbed={setEmbed}
                                    setTab={setTab}
                                    practical={data[0].practical}
                                />
                            )}
                            {tab === 'pdf' && <EmbedPdf embed={embed} />}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Page;
