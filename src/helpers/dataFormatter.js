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
      createdAt: data.createdAt,
      id: data.id,
      name: data.name,
      brand: data.brand,
      price: data.price,
      category: data.category,
      description: geminiPrompt|| data.description,
      imageUrls: data.imageUrls,
    };
  }
  // helper function to format user data
  // yesma chai hamile user ko chahine data matra return garxau ani sensitive data like password, token haru return gardainau