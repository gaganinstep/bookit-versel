exports.routeParams = [
    {
        route: 'photogallery/upload',
        method: 'post',
        authRequired: false,
        tag: 'photogallery',
        params: {},
        queryParams: [
            { key: 'uploaded_by', type: 'uuid', required: true },
            { key: 'business_id', type: 'uuid', required: true },
            { key: 'photo_url', type: 'string', required: true },
            { key: 'is_visible', type: 'boolean', required: false }
        ]
    },
]