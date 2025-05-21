import request from '@renderer/utils/request'

export function getDoc(name: string): Promise<any> {
  return request({
    url: '/admin/client/doc',
    method: 'get',
    params: { name },
  })
}
