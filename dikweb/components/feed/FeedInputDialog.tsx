import { useEffect, useRef, useState } from 'react'
import Router from 'next/router'
import { Avatar, IconButton } from '@material-ui/core'
import styled from 'styled-components'
import FeedInputButton from './FeedInputButton'
import Button from '../button/Button'
import { UserProfileType } from '../../types/profile.type'
import FeedTypeAttribute from './FeedTypeAttribute'
import RichTextEditor from '../utils/RichTextEditor'
import { useCreatePostMutation } from '../../generated/graphql'
import CreatePost from '../../lib/createpost'

import PhotoSizeSelectActualIcon from '@material-ui/icons/PhotoSizeSelectActual'
import MenuBookIcon from '@material-ui/icons/MenuBook'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'
import MicIcon from '@material-ui/icons/Mic'
import CloseIcon from '@material-ui/icons/Close'
import DeleteSweepTwoToneIcon from '@material-ui/icons/DeleteSweepTwoTone'
import KeyboardArrowDownRoundedIcon from '@material-ui/icons/KeyboardArrowDownRounded'
import KeyboardArrowUpRoundedIcon from '@material-ui/icons/KeyboardArrowUpRounded'
import CircularProgress from '@material-ui/core/CircularProgress'

interface Props {
	profile: UserProfileType
	onCloseCallback: () => void
	onUploadCallback: () => void
}

export default function FeedInputDialog(props: Props) {
	/**
	 * @Caption
	 * Handle and store user caption input
	 * e.g determine if caption contains only whitespace
	 */
	const [caption, setCaption] = useState<string | null>(null)

	/**
	 * @usage to handle caption content which came from
	 * RichTextEditor component. If there is an input
	 * more than a letter, set caption hook.
	 * Otherwise, set to null.
	 */
	const handleCaptionChange = (content: any) => {
		if (!content) {
			return setCaption(null)
		}
		setCaption(content)
	}

	/**
	 * @PostType
	 * Handle and store post type
	 * "public" or "private"
	 */
	const [postType, setPostType] = useState<string>('public')

	/**
	 * @ImageBlob
	 * Handle and store user raw image input
	 * e.g upload raw image to cloudinary
	 */
	const [rawImage, setRawImage] = useState<Blob | null>(null)

	/**
	 * @ImagePreview
	 * Handle and store user image input
	 * e.g show the preview of image that is just uploaded
	 */
	const [imagePreview, setImagePreview] = useState<
		string | ArrayBuffer | null
	>(null)

	/**
	 * @PreviewMinimized @MobileOnly
	 * Handle minimize attachments preview
	 * to save more space to write caption on mobile
	 */
	const [previewMinimized, setPreviewMinimized] = useState<boolean>(false)

	/**
	 * @ImageRef
	 * Handle reference to <input> type image
	 * i.e this hook is used to perform event to the element
	 * e.g click, double click, etc
	 */
	const inputImageRef = useRef<HTMLInputElement | null>(null)

	/**
	 * This is a provided hook generated by graphql-codegen.
	 * @usage to create a new post and send it to the backend, it also provided
	 * helper function and result like { loading, data, error }
	 * @see https://www.apollographql.com/docs/react/data/mutations/#options
	 */
	const [createPost] = useCreatePostMutation()

	/**
	 * When a user uploaded their post to the server,
	 * there will be always time to wait. Use this state
	 * to render spinner and determine loading state, either false or true
	 */
	const [loadingState, setLoadingState] = useState<boolean>(false)

	/**
	 * @function handlePostSubmit()
	 * Handle everything to upload post to database.
	 * First thing first, upload all media to cloudinary (if any),
	 * Submit back to backend as a string URL
	 */
	const handlePostSubmit = async () => {
		if (!caption) return
		setLoadingState(true)

		/**
		 * @usage handle all uploading post logic
		 * e.g uploading attachments/media, etc
		 * @see 'lib/createpost.tsx'
		 */
		const requestToServer = await CreatePost({
			useHook: createPost,
			caption: caption,
			postType: postType,
			rawImage: rawImage,
		})

		// Error handling, future works :)
		if (requestToServer.error) {
			// If user auth is expired push to auth page
			if (
				requestToServer.error.graphQLErrors[0].extensions.status === 403
			) {
				return Router.push('/auth')
			}
			console.log(requestToServer.error)
			return setLoadingState(false)
		}

		// if everything goes well, set loading to false
		setLoadingState(false)
		// trigger parent to update feeds
		props.onUploadCallback()
		// close FeedInputDialog
		props.onCloseCallback()
	}

	/**
	 * This @useEffect hook is used to track uploaded media
	 * And automatically re-render components
	 * When some sort of media uploaded changes
	 */
	useEffect(() => {
		if (rawImage) {
			/**
			 * If user uploaded image
			 * Set the media to @useState hook to be
			 * Used and rendered with image tag
			 */
			const reader = new FileReader()
			reader.onloadend = () => {
				// set image preview URL
				setImagePreview(reader.result)
			}
			reader.readAsDataURL(rawImage)
		} else {
			setImagePreview(null)
		}
	}, [rawImage])

	return (
		<FeedInputDialogWrapper>
			<FeedInputDialogHeader>
				<FeedInputProfileWrapper>
					{/* Avatar */}
					<IconButton>
						<Avatar src={props.profile.avatar_url} />
					</IconButton>

					<FeedInputProfileAttributeWrapper>
						{/* Username */}
						<FeedInputDialogUsername>
							{props.profile.username}
						</FeedInputDialogUsername>

						{/* Feed Type Attribute */}
						<FeedTypeAttribute
							disablePrivate={
								!props.profile.relationship ? true : false
							}
							postTypeValue={postType}
							onChangeCallbacks={(
								event: React.ChangeEvent<{
									value: unknown
								}>
							) => {
								setPostType(event.target.value as string)
							}}
						/>
					</FeedInputProfileAttributeWrapper>
				</FeedInputProfileWrapper>

				<FeedInputDialogHeaderButton>
					{/* Close Button */}
					<IconButton onClick={props.onCloseCallback}>
						<CloseIcon style={{ color: '#fff' }} />
					</IconButton>
				</FeedInputDialogHeaderButton>
			</FeedInputDialogHeader>

			<FeedInputDialogBody>
				{/* Rich Text Area Input */}
				<RichTextAreaWrapper
					previewMinimized={previewMinimized}
					hasAttachments={rawImage ? true : false}
				>
					<RichTextEditor onChangeCallback={handleCaptionChange} />
				</RichTextAreaWrapper>

				{/* If there is previewed media uploaded */}
				{imagePreview ? (
					<FeedinputDialogPreview>
						{/* Preview Header */}
						<FeedInputDialogPreviewHeader>
							{/* Header Text */}
							<FeedInputDialogPreviewText>
								Attachment Preview
							</FeedInputDialogPreviewText>

							{/* Header Button */}
							<FeedInputDialogPreviewButton>
								{/* Minimize Button */}
								<FeedInputDialogPreviewMinimize>
									{!previewMinimized ? (
										<IconButton
											onClick={() =>
												setPreviewMinimized(true)
											}
										>
											<KeyboardArrowDownRoundedIcon
												style={{
													color: 'var(--font-white-800)',
												}}
											/>
										</IconButton>
									) : (
										<IconButton
											onClick={() =>
												setPreviewMinimized(false)
											}
										>
											<KeyboardArrowUpRoundedIcon
												style={{
													color: 'var(--font-white-800)',
												}}
											/>
										</IconButton>
									)}
								</FeedInputDialogPreviewMinimize>

								{/* Cancel Upload Attachments */}
								<IconButton
									onClick={() => {
										setRawImage(null)
										setPreviewMinimized(false)
									}}
								>
									<DeleteSweepTwoToneIcon
										style={{
											color: 'var(--font-white-800)',
										}}
									/>
								</IconButton>
							</FeedInputDialogPreviewButton>
						</FeedInputDialogPreviewHeader>

						{/* Image Preview */}
						<FeedInputDialogPreviewImage
							src={imagePreview as string}
							minimized={previewMinimized}
						/>
					</FeedinputDialogPreview>
				) : undefined}
			</FeedInputDialogBody>

			<FeedInputDialogFooter>
				{/* Upload Attachments Button*/}
				<FeedInputDialogAttachments>
					{/* Image */}
					<FeedInputButton
						title="Photo"
						hideTitleOnMobile
						Icon={PhotoSizeSelectActualIcon}
						iconColor="#0091ff"
						onClickCallback={() => inputImageRef.current!.click()}
					/>
					<input
						type="file"
						style={{ display: 'none' }}
						ref={inputImageRef}
						accept="image/*"
						onChange={(event) => {
							// If there is no uploaded file, return
							if (!event.target.files) return

							const file = event.target.files[0]

							// Check if type is image or not
							if (file && file.type.substr(0, 5) === 'image') {
								setRawImage(file)
							} else {
								setRawImage(null)
							}
						}}
					/>

					{/* Video */}
					<FeedInputButton
						Icon={PlayCircleFilledIcon}
						title="Video"
						hideTitleOnMobile
						iconColor="#b46e8b"
					/>

					{/* Audio */}
					<FeedInputButton
						Icon={MicIcon}
						hideTitleOnMobile
						title="Audio"
						iconColor="#4cc04b"
					/>

					{/* Story */}
					<FeedInputButton
						Icon={MenuBookIcon}
						hideTitleOnMobile
						title="Story"
						iconColor="#ddd07b"
					/>
				</FeedInputDialogAttachments>

				{/* Submit Button */}
				<FeedInputDialogUpload>
					{/* If Loading State is True => Render Spinner */}
					{loadingState ? (
						<CircularProgress
							size={25}
							style={{ color: 'var(--color-primary)' }}
						/>
					) : (
						<Button
							text="Post"
							type="button"
							border="none"
							color="var(--font-white-800)"
							borderRadius="20px"
							fontSize="16px"
							fontWeight="bold"
							padding="8px 24px"
							hoverBg="var(--color-primary)"
							hoverBoxShadow="var(--box-shadow)"
							// disable if there is no caption input
							disabled={!caption ? true : false}
							onClick={() => handlePostSubmit()}
						/>
					)}
				</FeedInputDialogUpload>
			</FeedInputDialogFooter>
		</FeedInputDialogWrapper>
	)
}

const FeedInputDialogWrapper = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
	background-color: var(--background-dimmed-500);
	padding: 8px;
`
const FeedInputDialogHeader = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	padding: 0px 8px;

	@media (max-width: 600px) {
		align-items: center;
	}
`
const FeedInputProfileWrapper = styled.div`
	display: flex;
	align-items: center;
`

const FeedInputProfileAttributeWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 14px 4px 4px 4px;
	gap: 6px;

	@media (max-width: 600px) {
		padding: 8px 4px;
	}
`

const FeedInputDialogUsername = styled.p`
	color: var(--font-white-800);
	font-weight: bold;
	font-size: 16px;
`
const FeedInputDialogBody = styled.div`
	display: flex;
	align-items: flex-start;
	height: 100%;
	padding: 0px 8px;

	@media (max-width: 600px) {
		flex-direction: column;
		align-items: center;
		padding: 0px;
	}
`

const RichTextAreaWrapper = styled.div<{
	previewMinimized?: boolean
	hasAttachments?: boolean
}>`
	@media (max-width: 600px) {
		max-height: ${(props) =>
			!props.previewMinimized ? '200px' : undefined};
		overflow: auto;
		flex-grow: 1;
	}
`

const FeedinputDialogPreview = styled.div`
	padding: 8px 18px;
	max-width: 350px;

	@media (max-width: 600px) {
		padding: 0px;
		width: 100%;
		max-width: 100%;
	}
`
const FeedInputDialogPreviewHeader = styled.div`
	padding: 0px 8px;
	display: flex;
	margin-bottom: 8px;
	justify-content: space-between;
	align-items: center;

	@media (max-width: 600px) {
		background-color: var(--background-dimmed-300);
	}
`
const FeedInputDialogHeaderButton = styled.div`
	display: flex;
	align-items: center;
`

/** PREVIEW */
const FeedInputDialogPreviewImage = styled.img<{
	minimized?: boolean
}>`
	width: 100%;
	height: 100%;
	display: ${(props) => (props.minimized ? 'none' : 'inherit')};
	max-width: 450px;
	max-height: 350px;
	object-fit: cover;

	@media (max-width: 600px) {
		max-width: 100%;
		min-height: 300px;
		max-height: 300px;
	}
`
const FeedInputDialogPreviewText = styled.h3`
	color: var(--font-white-800);
	padding: 18px 0px;

	@media (max-width: 600px) {
		font-size: 14px;
		padding: 4px;
	}
`
const FeedInputDialogPreviewButton = styled.div`
	display: flex;
	align-items: center;
`
const FeedInputDialogPreviewMinimize = styled.div`
	@media (min-width: 600px) {
		display: none;
	}
`
const FeedInputDialogFooter = styled.div`
	justify-content: space-between;
	align-items: center;
	display: flex;
	padding: 0px 24px;

	@media (max-width: 600px) {
		padding: 4px;
	}
`
const FeedInputDialogAttachments = styled.div`
	display: flex;
`
const FeedInputDialogUpload = styled.div``
