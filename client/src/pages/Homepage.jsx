import { Flex, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import useShowToast from '../hooks/useShowToast';
import Post from '../components/Post';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/postsAtom';

const Homepage = () => {
	const showToast = useShowToast();
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getFeedPosts = async () => {
			setLoading(true);
			setPosts([]);
			try {
				const res = await fetch('/api/posts/feed');
				const data = await res.json();
				console.log(data);
				if (data.error) {
					showToast('Error', data.error, 'error');
					return;
				}
				setPosts(data);
			} catch (error) {
				showToast('Error', error, 'error');
			} finally {
				setLoading(false);
			}
		};
		getFeedPosts();
	}, [showToast, setPosts]);

	return (
		<>
			{loading && (
				<Flex justifyContent={'center'}>
					<Spinner size={'xl'} />
				</Flex>
			)}
			{!loading && posts.length == 0 && <h1>Follow some users to see their posts</h1>}

			{posts.map(post => (
				<Post key={post._id} post={post} postedBy={post.postedBy} />
			))}
		</>
	);
};

export default Homepage;
