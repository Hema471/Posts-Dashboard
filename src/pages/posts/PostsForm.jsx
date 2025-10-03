import React from "react";
import { Formik, Field, Form, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addPost, updatePost } from "../../features/posts/postsSlice";
import { X } from "lucide-react";

// Validation Schema
const PostSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .required("Title is required"),

  body: Yup.string()
    .min(10, "Body must be at least 10 characters")
    .required("Body is required"),

  // per-tag validation
  tags: Yup.array().of(
    Yup.string()
      .min(2, "Tag must be at least 2 characters")
      .required("Tag cannot be empty")
  ),

  // array length validation
  tagsLength: Yup.number()
    .min(1, "At least one tag is required")
    .max(5, "You can add 5 tags maximum"),
});

const PostsForm = ({ onClose, editing }) => {
  const dispatch = useDispatch();

  return (
    <div className="max-h-[80vh] overflow-auto p-1">
      {/* Form */}
      <Formik
        initialValues={{
          title: editing?.title || "",
          body: editing?.body || "",
          tags: editing?.tags || [],
          tagsLength: editing?.tags?.length || 0,
        }}
        validationSchema={PostSchema}
        onSubmit={(values) => {
          // don’t send tagsLength to backend
          const { tagsLength, ...formData } = values;

          if (editing) {
            dispatch(updatePost({ id: editing.id, formData }));
            toast.success("Post updated");
          } else {
            dispatch(addPost(formData));
            toast.success("Post added successfully");
          }
          onClose();
        }}
        enableReinitialize
      >
        {({ values }) => (
          <Form className="space-y-4">
            {/* Title */}
            <div>
              <Field
                name="title"
                type="text"
                placeholder="Title"
                className="border rounded-xl p-3 w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Body */}
            <div>
              <Field
                as="textarea"
                name="body"
                placeholder="Body"
                rows={4}
                className="border rounded-xl p-3 w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
              <ErrorMessage
                name="body"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Tags */}
            <div>
              <FieldArray name="tags">
                {({ push, remove, form }) => (
                  <div className="space-y-2">
                    {values?.tags?.map((tag, index) => (
                      <div key={index} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Field
                            name={`tags.${index}`}
                            placeholder="Enter tag"
                            className="border rounded-xl p-2 w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              remove(index)
                              form.setFieldValue("tagsLength", form.values?.tags?.length - 1);
                            }}
                            className="p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
                          >
                            <div className="bg-red-500 rounded-full p-1">
                              <X
                                size={18}
                                className="text-white font-bold text-center"
                              />
                            </div>
                          </button>
                        </div>
                        {/* Show error for each tag */}
                        <ErrorMessage
                          name={`tags.${index}`}
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        push("");
                        form.setFieldValue("tagsLength", form.values?.tags?.length + 1);
                      }}
                      className="cursor-pointer text-sm px-3 py-2 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 transition"
                    >
                      + Add Tag
                    </button>
                  </div>
                )}
              </FieldArray>

              {/* Array-level errors (min/max count) */}
              <ErrorMessage
                name="tagsLength"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cursor-pointer px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white shadow transition"
              >
                {editing ? "Update" : "Add"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PostsForm;
