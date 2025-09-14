import { useDispatch, useSelector } from "react-redux";
import { deletePost } from "../../features/posts/postsSlice";
import toast from "react-hot-toast";
import Table from "./../../components/Table";

import {
  Pencil,
  Trash2,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Tags,
  XCircle,
} from "lucide-react";

export default function PostsTable({ onEdit }) {
  const { list, loading, error, updating, deleting } = useSelector(
    (s) => s.posts
  );
  const dispatch = useDispatch();

  const handleDelete = async (id) => {
    await dispatch(deletePost(id));
    toast.success("Post deleted");
  };

  const columns = [
    { header: "Title" },
    { header: "Body" },
    { header: "Tags", align: "text-center" },
    { header: "Reactions", align: "text-center" },
    { header: "Views", align: "text-center" },
    { header: "Actions", align: "text-center" },
  ];

  const renderRow = (post) => (
    <tr key={post?.id} className="border-b border-b-gray-300 hover:bg-gray-50">
      {/* Title */}
      <td className="px-2 sm:px-4 py-2 font-semibold truncate max-w-[120px] sm:max-w-xs">
        {post?.title}
      </td>

      {/* Body */}
      <td className="px-2 sm:px-4 py-2 text-gray-600 xl:truncate max-w-[140px] sm:max-w-md">
        {post.body?.slice(0, 19) + "..."}
      </td>

      {/* Tags */}
      <td className="px-2 sm:px-4 py-2 text-center">
        <div className="flex flex-wrap justify-center gap-1">
          {post?.tags?.length > 0 ? (
            post?.tags?.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-[10px] sm:text-xs rounded-full bg-blue-100 text-blue-600 flex items-center gap-1"
              >
                <Tags size={12} /> {tag}
              </span>
            ))
          ) : (
            <span className="flex items-center justify-center gap-1 text-gray-400 text-xs sm:text-sm">
              <XCircle size={14} /> No Tags
            </span>
          )}
        </div>
      </td>

      {/* Reactions */}
      <td className="px-2 sm:px-4 py-2 text-center">
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <span className="flex items-center gap-1 text-green-600 text-xs sm:text-sm">
            <ThumbsUp size={14} /> {post?.reactions?.likes || 0}
          </span>
          <span className="flex items-center gap-1 text-red-600 text-xs sm:text-sm">
            <ThumbsDown size={14} /> {post?.reactions?.dislikes || 0}
          </span>
        </div>
      </td>

      {/* Views */}
      <td className="px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">
        <span className="flex items-center justify-center gap-1">
          <Eye size={14} /> {post?.views || 0}
        </span>
      </td>

      {/* Actions */}
      {/* Actions */}
      <td className="px-2 sm:px-4 py-2 text-center">
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {/* Edit */}
          <button
            onClick={() => onEdit(post)}
            disabled={updating}
            className="cursor-pointer px-2 sm:px-3 py-1.5 rounded-lg flex items-center gap-1 
            text-white bg-indigo-500 hover:bg-indigo-600 hover:shadow-md transition 
            disabled:bg-indigo-300 disabled:cursor-not-allowed disabled:opacity-70 
            text-xs sm:text-sm"
          >
            <Pencil size={14} />
            {updating ? "Saving..." : "Edit"}
          </button>

          {/* Delete */}
          <button
            onClick={() => handleDelete(post.id)}
            disabled={deleting === post?.id}
            className="cursor-pointer px-2 sm:px-3 py-1.5 rounded-lg flex items-center gap-1 
            text-white bg-rose-500 hover:bg-rose-600 hover:shadow-md transition 
            disabled:bg-rose-300 disabled:cursor-not-allowed disabled:opacity-70 
            text-xs sm:text-sm"
          >
            <Trash2 size={14} />
            {deleting === post?.id ? "Deleting..." : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <Table
      columns={columns}
      data={list}
      loading={loading}
      error={error}
      emptyMessage="No posts found"
      renderRow={renderRow}
    />
  );
}
