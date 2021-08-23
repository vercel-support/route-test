import type { GetStaticProps, GetStaticPaths } from 'next';

type PageProps = {
  variant?: string
}

export default function TestPage({ variant }: PageProps) {
  return (
    <strong>{variant}</strong>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<PageProps, { variant: string }> =
  async ({ params }) => ({
    props: {
      variant: params?.variant,
    },
    revalidate: 10,
  })
