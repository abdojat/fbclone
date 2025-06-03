// /src/pages/PostPage.js


import { useParams } from 'react-router-dom';
import PostFeed from '../components/PostFeed';
import PageLayout from '../components/PageLayout';
import { Divider } from '@mui/material';

const PostPage = () => {
    const { postId } = useParams();
    console.log(postId);
    return (
        <PageLayout>
            <Divider sx={{ my: 4 }} />
            <PostFeed postById={postId} />
        </PageLayout>
    );
};

export default PostPage;