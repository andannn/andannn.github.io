import getSortedPostsdata from "./posts";

test('getSortedPostsdata test', () => {
    const sortedPosts = getSortedPostsdata()
    // console.log(sortedPosts)
    expect(sortedPosts.length !== 0).toBe(true);
});
