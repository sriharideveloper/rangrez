export const product = {
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    },
    {
      name: "price",
      title: "Price",
      type: "number",
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Bridal", value: "Bridal" },
          { title: "Festival", value: "Festival" },
          { title: "Everyday", value: "Everyday" },
        ],
      },
    },
    {
      name: "style",
      title: "Style",
      type: "string",
      options: {
        list: [
          { title: "Floral", value: "Floral" },
          { title: "Geometric", value: "Geometric" },
          { title: "Paisley", value: "Paisley" },
          { title: "Arabic", value: "Arabic" },
        ],
      },
    },
    {
      name: "availability",
      title: "Availability",
      type: "string",
      options: {
        list: [
          { title: "In Stock", value: "In Stock" },
          { title: "Sale", value: "Sale" },
          { title: "Out of Stock", value: "Out of Stock" },
        ],
      },
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "image",
      title: "Images",
      type: "image",
      options: { hotspot: true },
    },
  ],
};
