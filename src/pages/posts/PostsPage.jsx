import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPosts,
  setPage,
  setSearch,
} from "../../features/posts/postsSlice";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Input from "../../components/Input";
import PostsTable from "./PostsTable";
import Modal from "../../components/Modal";
import PostsForm from "./PostsForm";

export default function PostsPage() {
  const dispatch = useDispatch();
  const { page, search, limit, total, list, loading } = useSelector(
    (s) => s.posts
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    dispatch(fetchPosts({ search, page, limit }));
  }, [search, page, limit]);

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6 bg-gray-100">
      {/* Search + Add Post */}
      <div className="flex justify-between items-center ">
        <div className="relative w-1/2">
          <div className="relative w-full max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
            <Input
              placeholder="Search posts..."
              value={search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
              className="pl-9 w-full"
            />
          </div>
        </div>

        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="cursor-pointer flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl shadow transition"
        >
          <Plus size={18} /> Add Post
        </button>
      </div>

      {/* Table */}
      <PostsTable
        onEdit={(post) => {
          setEditing(post);
          setModalOpen(true);
        }}
      />

      {/* Pagination */}
      {!loading && list?.length > 0 && (
        <div className="flex justify-between items-center">
          <button
            onClick={() => dispatch(setPage(Math.max(1, page - 1)))}
            disabled={page === 1}
            className="cursor-pointer flex items-center gap-1 bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} /> Prev
          </button>

          <span className="text-gray-600 font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() =>
              dispatch(setPage(page < totalPages ? page + 1 : page))
            }
            disabled={page >= totalPages}
            className="cursor-pointer flex items-center gap-1 bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        title={editing ? "Edit Post" : "Add Post"}
      >
        <PostsForm onClose={() => setModalOpen(false)} editing={editing} />
      </Modal>
    </div>
  );
}
