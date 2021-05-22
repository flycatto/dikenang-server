import {
	forwardRef,
	Inject,
	Injectable,
	RequestTimeoutException,
} from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { GoogleDTO } from './dto/google.dto'
import Randomize from './utils/Randomize'

@Injectable()
export class AuthService {
	constructor(
		@Inject(forwardRef(() => UsersService))
		private usersService: UsersService
	) {}

	async googleAuth(res: GoogleDTO) {
		if (!res) {
			return RequestTimeoutException
		}

		/**
		 * Search for available user in database;
		 * if none exist => create new
		 * if exist => return back
		 */
		const user = await this.usersService.findOauth(res.oauth_id)

		if (!user) {
			//  Create new user with the data from google
			return await this.usersService.create({
				oauth_id: res.oauth_id,
				email: res.email,
				// create random username
				// will generate something like 'res_phc56FWNRX2w'
				username: Randomize(res.given_name),
				avatar_url: res.profile_url,
			})
		}

		return user
	}
}
