import { useQuery, useMutation } from "@tanstack/react-query";
import { FaGithubAlt, FaUserMinus, FaUserPlus } from "react-icons/fa";
import {
  checkIfFollowingUser,
  followGithubUser,
  unFollowGithubUser,
} from "../api/github";
import type { GithubUser } from "../types";
import { toast } from "sonner";

const UserCard = ({ user }: { user: GithubUser }) => {
  // Query to check if user is following
  const { data: isFollowing, refetch } = useQuery({
    queryKey: ["follow-status", user.login],
    queryFn: () => checkIfFollowingUser(user.login),
    enabled: !!user.login,
  });

  // Mutation to follow user
  const followMutation = useMutation({
    mutationFn: () => followGithubUser(user.login),
    onSuccess: () => {
      toast.success(`You are now following ${user.login}`);
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  // Mutation to follow user
  const unFollowMutation = useMutation({
    mutationFn: () => unFollowGithubUser(user.login),
    onSuccess: () => {
      toast.success(`You are no longer following ${user.login}`), refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleFollow = () => {
    if (isFollowing) {
      unFollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };
  return (
    <div className="user-card">
      <img src={user.avatar_url} className="avatar" alt={user.name} />
      <h2>{user.name || user.login}</h2>
      <p className="bio">{user.bio}</p>
      <div className="user-card-buttons">
        <button
          disabled={followMutation.isPending || unFollowMutation.isPending}
          onClick={handleFollow}
          className={`follow-btn ${isFollowing ? "following" : ""}`}
        >
          {isFollowing ? (
            <>
              <FaUserMinus className="follow-icon" />
              Following
            </>
          ) : (
            <>
              <FaUserPlus className="follow-icon" />
              Follow User
            </>
          )}
        </button>
        <a
          href={user.html_url}
          className="profile-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithubAlt />
          View Github Profile
        </a>
      </div>
    </div>
  );
};

export default UserCard;
