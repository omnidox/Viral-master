export const DefaultProfilePicture = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png';

export const Role = {
    Guest: 'guest',
    // Signed in
    User: 'user',
    Admin: 'admin',
};

// Checking whether a username exists
export const UsernameState = {
    Empty: '', // Username field is empty
    // Requested username is already taken
    Taken: {
        icon: 'fa-solid fa-circle-xmark',
        variant: 'danger',
        message: 'taken',
    },
    // Requested username is available
    Available: {
        icon: 'fa-solid fa-circle-check',
        variant: 'success',
        message: 'available',
    }
};

export const UserVoteState = {
    None: '',
    UpVote: 'upVote',
    DownVote: 'downVote',
}