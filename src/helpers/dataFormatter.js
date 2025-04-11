export function formatUserData(data) {
    return {
      address: data.address,
      createdAt: data.createdAt,
      email: data.email,
      id: data.id,
      name: data.name,
      phone: data.phone,
      roles: data.roles,
      profileImageUrl: data.profileImageUrl,
    };
  }


  export function formatProductData(data, geminiPrompt) {
    return {
      brand: data.brand,
      category: data.category,
      createdAt: data.createdAt,
      description: data.description,
      id: data._id,
      imageUrls: data.imageUrls,
      name: data.name,
      price: data.price,
    };
  }
  // helper function to format user data
  // yesma chai hamile user ko chahine data matra return garxau ani sensitive data like password, token haru return gardainau