import PostList from '../components/PostList';
import API from '../api/api';
import { USERS } from '../api/endpoints';

const SavedPosts = () => {
  const fetchPosts = async () => {
    const savedRes = await API.get(USERS.savedPosts);
    return savedRes.data.data;
  };
  return <PostList fetchPosts={fetchPosts} emptyMessage="You have no saved posts yet." />;
};

export default SavedPosts;
