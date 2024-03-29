import { Avatar, Box, Button, Flex, Link, Menu, MenuButton, MenuItem, MenuList, Portal, Text, VStack, useToast } from '@chakra-ui/react';
import { CgMoreO } from 'react-icons/cg';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import useShowToast from '../hooks/useShowToast';

const UserHeader = ({ user }) => {
	const toast = useToast();
	const currentUser = useRecoilValue(userAtom); //log in user
	const [following, setFollowing] = useState(user.followers.includes(currentUser?._id));
	const showToast = useShowToast();
	const [updating, setUpdating] = useState(false);
	const copyURL = () => {
		const currentURL = window.location.href;
		navigator.clipboard.writeText(currentURL).then(() => {
			toast({
				description: 'URL copiada para a área de transferência',
			});
		});
	};

	const handleFollowUnfollow = async () => {
		if (!currentUser) {
			showToast('Error', 'You must be logged in to follow', 'error');
			return;
		}
		if (updating) return;

		setUpdating(true);
		try {
			const res = await fetch(`/api/users/follow/${user._id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const data = await res.json();

			if (data.error) {
				showToast('Error', data.error, 'error');
				return;
			}

			if (following) {
				showToast('Success', 'You have unfollowed this user', 'success');
				user.followers.pop(); //remove user from followers
			} else {
				showToast('Success', 'You have followed this user', 'success');
				user.followers.push(currentUser?._id); //add user to followers
			}

			setFollowing(!following);
		} catch (error) {
			showToast('Error', error, 'error');
		} finally {
			setUpdating(false);
		}
	};

	return (
		<VStack gap={4} alignItems={'start'}>
			<Flex justifyContent={'space-between'} w={'full'}>
				<Box>
					<Text fontSize={'2xl'} fontWeight={'bold'}>
						{user.name}
					</Text>
					<Flex gap={2} alignItems={'center'}>
						<Text fontSize={'sm'}>{user.username}</Text>
						<Text fontSize={'xs'} bg={'gray.dark'} color={'gray.light'} p={1} borderRadius={'full'}>
							socialapp.net
						</Text>
					</Flex>
				</Box>
				<Box>
					{user.profilePic && (
						<Avatar
							name={user.name}
							src={user.profilePic}
							size={{
								base: 'md',
								md: 'xl',
							}}
						/>
					)}
					{!user.profilePic && (
						<Avatar
							name={user.name}
							src='https://bit.ly/broken-link'
							size={{
								base: 'md',
								md: 'xl',
							}}
						/>
					)}
				</Box>
			</Flex>

			<Text>{user.bio}</Text>

			{currentUser?._id === user._id && (
				<Link as={RouterLink} to='/update'>
					<Button size={'sm'}>Update Profile</Button>
				</Link>
			)}
			{currentUser?._id !== user._id && (
				<Button size={'sm'} onClick={handleFollowUnfollow} isLoading={updating}>
					{following ? 'Unfollow' : 'Follow'}
				</Button>
			)}
			<Flex w={'full'} justifyContent={'space-between'}>
				<Flex gap={2} alignItems={'center'}>
					<Text color={'gray.light'}>{user.followers.length} followers</Text>
				</Flex>
				<Flex>
					<Box className='icon-container'>
						<Menu>
							<MenuButton>
								<CgMoreO size={24} cursor={'pointer'} />
							</MenuButton>
							<Portal>
								<MenuList bg={'gray.dark'}>
									<MenuItem bg={'gray.dark'} color={'gray.100'} onClick={copyURL}>
										Copy link
									</MenuItem>
								</MenuList>
							</Portal>
						</Menu>
					</Box>
				</Flex>
			</Flex>

			<Flex w={'full'}>
				<Flex flex={1} borderBottom={'1.5px solid white'} justifyContent={'center'} pb='3' cursor={'pointer'}>
					<Text fontWeight={'bold'}> Posts</Text>
				</Flex>
			</Flex>
		</VStack>
	);
};

export default UserHeader;
