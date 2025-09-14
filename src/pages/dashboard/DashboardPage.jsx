import { useEffect } from "react";
import { Search } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, setSearch } from "../../features/posts/postsSlice";
import Card from "../../components/Card";
import CardContent from "../../components/CardContent";
import Input from "../../components/Input";


export default function DashboardPage() {
  const dispatch = useDispatch();
  const { search, list, loading } = useSelector((s) => s.posts);

  useEffect(() => {
    dispatch(fetchPosts({ search, limit: 30, page: 1 }));
  }, [search]);

  // Stats
  const totalPosts = list?.length;
  const totalViews = list?.reduce((acc, p) => acc + (p?.views || 0), 0);
  const totalReactions = list?.reduce(
    (acc, p) =>
      acc +
      (typeof p?.reactions === "object"
        ? p.reactions.likes - p.reactions.dislikes
        : p.reactions || 0),
    0
  );

  // Tags distribution for Pie
  const tagCounts = {};
  list?.forEach((p) =>
    p?.tags?.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    })
  );
  const pieData = Object.entries(tagCounts)?.map(([tag, count]) => ({
    name: tag,
    value: count,
  }));

  // Views per post for Bar
  const barData = list?.map((p) => ({
    name: p?.title?.slice(0, 12) + "...",
    views: p?.views || 0,
  }));

  // Recent posts (top 5)
  const recentPosts = list?.slice(0, 5);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Search */}
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

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardContent>
            <h3 className="text-gray-500">Total Posts</h3>
            <p className="text-3xl font-bold">{loading ? "..." : totalPosts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h3 className="text-gray-500">Total Views</h3>
            <p className="text-3xl font-bold">{loading ? "..." : totalViews}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h3 className="text-gray-500">Reactions</h3>
            <p className="text-3xl font-bold">
              {loading ? "..." : totalReactions}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Posts by Tags</h3>
          {pieData?.length > 0 && (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  fill="#6366F1"
                  label
                >
                  {pieData?.map((_, i) => (
                    <Cell
                      key={i}
                      fill={
                        ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"][
                          i % 5
                        ]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}

          {pieData?.length == 0 && (
            <p className="text-gray-500 text-sm">No posts found.</p>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Views per Post</h3>
          {barData?.length > 0 && (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {barData?.length == 0 && (
            <p className="text-gray-500 text-sm">No posts found.</p>
          )}
        </Card>
      </div>

      {/* Recent posts */}
      <Card>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          Recent Posts
          <span className="text-sm text-gray-500 font-medium">(Top 5)</span>
        </h3>
        <ul className="space-y-3">
          {recentPosts?.map((post) => (
            <li
              key={post?.id}
              className="p-3 border rounded-lg hover:bg-gray-50 transition"
            >
              <h4 className="font-medium">{post?.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-2">{post?.body}</p>
            </li>
          ))}
          {recentPosts?.length === 0 && (
            <p className="text-gray-500 text-sm">No posts found.</p>
          )}
        </ul>
      </Card>
    </div>
  );
}
