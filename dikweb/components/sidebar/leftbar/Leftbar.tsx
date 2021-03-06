import styled from 'styled-components'
import { UserProfileType } from '../../../types/profile.type'
import Card from '../../card/Card'
import SidebarHeader from '../header/SidebarHeader'
import SidebarHeaderProfile from '../header/SidebarHeaderProfile'

interface Props {
	profile: UserProfileType
}

export default function Leftbar({ profile }: Props) {
	return (
		<LeftBarWrapper>
			{/* Card */}
			<Card bgColor="var(--background-dimmed-500)">
				<SidebarHeader avatarSrc={profile.avatar_url} />
				<SidebarHeaderProfile
					username={profile.username}
					description={profile.bio}
				/>
			</Card>
		</LeftBarWrapper>
	)
}

const LeftBarWrapper = styled.div`
	flex: 0.2;
	display: flex;
	flex-direction: column;
	width: 100%;
	margin: 18px 8px;
	height: min-content;
	top: 20px;
	position: sticky;

	/* How mobile should behave */
	@media (max-width: 600px) {
		flex: 0;
		display: none;
	}
`
