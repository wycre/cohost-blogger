// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	type ASTMap = RootAST | ElementAST | TextAST

	interface RootAST {
		type: 'root',
		position?: any,
		children: ASTMap[]
	}
	interface ElementAST {
		type: 'element',
		position?: any,
		children: ASTMap[],
		properties: Record<string, any>,
		tagName: string
	}
	interface TextAST {
		type: 'text',
		position?: any,
		value: string
	}

	interface MarkdownStorageBlock {
    type: 'markdown',
    markdown: {
        /** Raw markdown to be parsed at render-time. */
        content: string,
    },
	}

	type AttachmentId = string

	interface AttachmentStorageBlock {
		type: 'attachment',
		attachment: {
			/** ID for the [[`Attachment`]] to be rendered. */
			attachmentId: AttachmentId,
			altText: string?,
			previewURL: string,
			fileURL: string,
			width: number?,
			height: number?,
		},
	}

	type StorageBlock = MarkdownStorageBlock | AttachmentStorageBlock

	enum AccessResult {
    Allowed = "allowed",
    NotAllowed = "not-allowed",
    LogInFirst = "log-in-first",
    Blocked = "blocked",
	}

	enum LimitedVisibilityReason {
		None = "none",
		LogInFirst = "log-in-first",
	}

	type PostId = number

	enum PostState {
    Unpublished = 0,
    Published,
    Deleted,
	}

	interface Post {
    postId: PostId,
    headline: string,
    publishedAt: string?,
    filename: string,
    transparentShareOfPostId: PostId?,
    shareOfPostId: PostId?,
    state: PostStateEnum,
    numComments: number,
    cws: string[],
    tags: tags[],
    hasCohostPlus: boolean,
    pinned: boolean,
    commentsLocked: boolean,
    sharesLocked: boolean,
		blocks: StorageBlock[],
		plainTextBody: string,
    postingProject: Project;
    shareTree: unknown[]; // TODO
    numSharedComments: number;
    relatedProjects: Project[];
    singlePostPageUrl: string;
    effectiveAdultContent: boolean;
    isEditor: boolean;
    hasAnyContributorMuted: boolean;
    contributorBlockIncomingOrOutgoing: boolean;
    postEditUrl: string;
    isLiked: boolean;
    canShare: boolean;
    canPublish: boolean;
    limitedVisibilityReason: LimitedVisibilityReason;
    astMap: {
			initial: string,
			initialLength: number,
			expanded: string,
			expandedLength: number,
		};
	}

	type CommentId = string

	interface Comment {
		comment: {
			commentId: CommentId,
			postedAtISO: string,
			deleted: boolean,
			body: string,
			children: Comment[],
			postId: PostId,
			inReplyTo: Comment?,
			hasCohostPlus: boolean,
			hidden: boolean
		},
		canInteract: AccessResult,
		canEdit: AccessResult,
		canHide: AccessResult,
		poster: Project
	}

	type ProjectId = number
	type ProjectHandle = string

	enum ProjectPrivacy {
    Public = "public",
    Private = "private",
	}

	enum ProjectFlag {
    Staff = "staff",
    StaffMember = "staffMember",
    FriendOfTheSite = "friendOfTheSite",
    NoTransparentAvatar = "noTransparentAvatar",
    Suspended = "suspended",
    Automated = "automated", // used for the bot badge
    Parody = "parody", // used for the "un-verified" badge
	};

	enum AvatarShape {
    Circle = "circle",
    RoundRect = "roundrect",
    Squircle = "squircle",
    CapsuleBig = "capsule-big",
    CapsuleSmall = "capsule-small",
    Egg = "egg",
	}

	enum LoggedOutPostVisibility {
		Public = "public",
		None = "none"
	}

	interface Project {
		projectId: ProjectId,
    handle: ProjectHandle,
    displayName: string,
    dek: string,
    description: string,
    avatarURL: string,
    avatarPreviewURL: string,
    headerURL: string?,
    headerPreviewURL: string?,
    privacy: ProjectPrivacyEnum,
    url: string?,
    pronouns: string?,
    flags: ProjectFlag[],
    avatarShape: AvatarShape,
    loggedOutPostVisibility: LoggedOutPostVisibility,
    frequentlyUsedTags: string[],
	}
}

export {};
