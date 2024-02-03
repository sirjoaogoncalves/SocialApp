import { Button, Flex, Image, useColorMode } from '@chakra-ui/react';
import userAtom from '../atoms/userAtom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { AiFillHome } from 'react-icons/ai';
import { Link, Link as RouterLink } from 'react-router-dom';
import { RxAvatar } from 'react-icons/rx';
import { FiLogOut } from 'react-icons/fi';
import useLogout from '../hooks/useLogout';
import authScreenAtom from '../atoms/authAtom';

const Header = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const user = useRecoilValue(userAtom);
	const logout = useLogout();
	const setAuthScreen = useSetRecoilState(authScreenAtom);

	return (
		<Flex justifyContent='space-between' mt={6} mb={12}>
			{user && (
				<Link as={RouterLink} to={'/'}>
					<AiFillHome size={24} />
				</Link>
			)}
			{!user && (
				<Link as={RouterLink} onClick={() => setAuthScreen('login')} to={'/auth'}>
					Login
				</Link>
			)}
			<Image cursor={'pointer'} alt='logo' w={6} src={colorMode === 'dark' ? '/light-on.png' : '/light-off.png'} onClick={toggleColorMode} />

			{user && (
				<Flex alignItems={'center'} gap={4}>
					<Link as={RouterLink} to={`/${user.username}`}>
						<RxAvatar size={24} />
					</Link>
					<Button size={'xs'} onClick={logout}>
						<FiLogOut size={20} />
					</Button>
				</Flex>
			)}
			{!user && (
				<Link as={RouterLink} onClick={() => setAuthScreen('signup')} to={'/auth'}>
					Sign Up
				</Link>
			)}
		</Flex>
	);
};

export default Header;
