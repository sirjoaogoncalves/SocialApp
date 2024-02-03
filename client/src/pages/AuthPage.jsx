import { useRecoilValue, useSetRecoilState } from 'recoil';
import LoginCard from '../components/LoginCard.jsx';
import SignupCard from '../components/SignupCard.jsx';
import authScreenAtom from '../atoms/authAtom.js';

const AuthPage = () => {
	const authScreenState = useRecoilValue(authScreenAtom);
	useSetRecoilState(authScreenAtom);

	return <>{authScreenState === 'login' ? <LoginCard /> : <SignupCard />}</>;
};

export default AuthPage;
