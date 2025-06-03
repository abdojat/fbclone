import PostList from '../components/PostList';
import API from '../api/api';
import { POSTS } from '../api/endpoints';

const PostFeed = ({ friendsOnly, userPostsById, postById }) => {
    const fetchPosts = async () => {
        if (friendsOnly) {
            const { data } = await API.get(POSTS.friendsFeed);
            return data;
        }
        if (userPostsById) {
            const { data } = await API.get(POSTS.userPosts(userPostsById));
            return data;
        }
        if (postById) {
            const { data } = await API.get(`/posts/post/${postById}`);
            console.log(data.data);
            return [data.data];
        }
        const { data } = await API.get(POSTS.all);
        return data;
    };

    return <PostList fetchPosts={fetchPosts} emptyMessage="No posts available" />;
};

export default PostFeed;
