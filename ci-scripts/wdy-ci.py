# -*- coding: utf-8 -*-
#!/usr/bin/python
#########################################
#Function:    WDY Frontend CI Script For Jenkins
#Usage:       python wdy-ci.py --mode=changecfg|upload|archive --workspace=path  --version=BUILD_NUMBER env=trunk|online|oper|product --arpath=archive_path
#Author:      wuqh@wjs.com
#Company:     wjs.com.
#Version:     1.0
#########################################

import sys, getopt, os, oss2, shutil

CIMode=''
workspace=''
version=''
env=''
archiveBasePath=''

#Server URL
_CONFIG_PRODUCT_WDY_URL_PREFIX='https://kf-static.wjs.com/'
_CONFIG_DEV_WDY_URL_PREFIX='https://kefeng-static.wjs-test.com/'

_CONFIG_PRODUCT_WDY_API_URL_PREFIX='https://kf-cardas.wjs.com/wdy'
_CONFIG_DEV_TRUNK_WDY_API_URL_PREFIX='https://kf-wdy.trunk.wjs-test.com/wdy'
_CONFIG_DEV_ONLINE_WDY_API_URL_PREFIX='https://kf-wdy.online.wjs-test.com/wdy'
_CONFIG_DEV_OPER_WDY_API_URL_PREFIX='https://kf-wdy.oper.wjs-test.com/wdy'


_CONFIG_DEV_TRUNK_CONTEXT='trunk'
_CONFIG_DEV_ONLINE_CONTEXT='online'
_CONFIG_DEV_OPER_CONTEXT='oper'

# OSS
OSS_AK='LTAI6csoDBLxnKJd'
OSS_SK='F36pQ4COGMZ6StgMBvGhEBIJMF2zFH'
OSS_ENDPOINT = 'http://oss-cn-shanghai-finance-1-pub.aliyuncs.com'
OSS_STORE_BUCKET='kf-static-test'

#
INDEX_JS_FILE_PATH='/config/index.js'
ENV_JS_FILE_PATH='/config/prod.env.js'
DIST_DIR_PATH='/dist'

def get_start_tag_def(tag):
    return  '//${tag-begin-' + tag + '}'

def get_end_tag_def(tag):
    return  '//${tag-end-' + tag + '}'

def check_tag_exist(script_content, tag, start_index):
    start_start, start_end, end_start, end_end = get_tag_range_index(script_content, tag, start_index)
    if start_start == -1 or end_start == -1:
        raise Exception('config script error:must contain comments pair [' + get_start_tag_def(tag) + ']and[' + get_end_tag_def(tag) + ']')

def get_tag_range_index(script_content, tag, start_index):
    if start_index == -1:
        return -1, -1, -1, -1

    start = get_start_tag_def(tag)
    end = get_end_tag_def(tag)

    start_tag_start_idx = script_content.find(start, start_index)
    if start_tag_start_idx == -1:
        end_tag_start_idx = script_content.find(end, start_index)
        if end_tag_start_idx == -1:
            return -1, -1, -1, -1
        else:
            return -1, -1, end_tag_start_idx, end_tag_start_idx + len(end)

    start_tag_end_idx = start_tag_start_idx + len(start)
    end_tag_start_idx = script_content.find(end, start_tag_start_idx)
    if end_tag_start_idx == -1:
        end_tag_end_idx = -1
    else:
        end_tag_end_idx = end_tag_start_idx + len(end)

    return start_tag_start_idx, start_tag_end_idx, end_tag_start_idx, end_tag_end_idx

def change_script_by_tag(script_content, tag, nullable):
    if(nullable != True):
        check_tag_exist(script_content, tag, 0)

    config_content = '\n' + get_content_by_tag(tag) + '\n'

    start_tag_start_idx = 0
    end_tag_start_idx = 0

    last_end_tag_start_idx = 0
    last_end_tag_end_idx = 0

    new_script_content = ''
    while(start_tag_start_idx != -1 and end_tag_start_idx != -1):
        start_tag_start_idx, start_tag_end_idx, end_tag_start_idx, end_tag_end_idx = get_tag_range_index(script_content, tag, last_end_tag_end_idx)
        if start_tag_end_idx == -1:
            break
        new_script_content = new_script_content + script_content[last_end_tag_start_idx:start_tag_end_idx] + config_content
        last_end_tag_end_idx = end_tag_end_idx
        last_end_tag_start_idx = end_tag_start_idx

    new_script_content = new_script_content + script_content[last_end_tag_start_idx:len(script_content)]
    return new_script_content

def get_content_by_tag(tag):
    if tag == 'ignore':
        return ''
    if tag == 'assetsPublicPath':
        return get_assets_public_path_config()
    if tag == 'API_HOST':
        return get_api_host_config()


def get_assets_public_path_config():
    return 'assetsPublicPath:"' + get_wdy_static_url() +  '",'

def get_api_host_config():
    return 'API_HOST:\'"' + get_wdy_api_url() +  '"\''

def get_wdy_static_url():
    if env == 'product':
        return _CONFIG_PRODUCT_WDY_URL_PREFIX
    else:
        return _CONFIG_DEV_WDY_URL_PREFIX + get_wdy_env_context() + '/'

def get_wdy_env_context():
    if env == 'product':
        return ''
    elif env == 'trunk' :
        return _CONFIG_DEV_TRUNK_CONTEXT
    elif env == 'online':
        return _CONFIG_DEV_ONLINE_CONTEXT
    elif env == 'oper':
        return _CONFIG_DEV_OPER_CONTEXT

    raise Exception('Unsupport env value')

def get_wdy_api_url():
    if env == 'product':
        return _CONFIG_PRODUCT_WDY_API_URL_PREFIX
    elif env == 'trunk' :
        return _CONFIG_DEV_TRUNK_WDY_API_URL_PREFIX
    elif env == 'online':
        return _CONFIG_DEV_ONLINE_WDY_API_URL_PREFIX
    elif env == 'oper':
        return _CONFIG_DEV_OPER_WDY_API_URL_PREFIX

def change_index_js():
    config_file_path = workspace + INDEX_JS_FILE_PATH

    file_r = open(config_file_path, 'r')
    script_content = file_r.read()
    file_r.close()

    script_content = change_script_by_tag(script_content, 'ignore', True)
    script_content = change_script_by_tag(script_content, 'assetsPublicPath', False)

    file_w = open(config_file_path, 'w')
    file_w.write(script_content)
    file_w.close()

def change_env_js():
    config_file_path = workspace + ENV_JS_FILE_PATH

    file_r = open(config_file_path, 'r')
    script_content = file_r.read()
    file_r.close()

    script_content = change_script_by_tag(script_content, 'ignore', True)
    script_content = change_script_by_tag(script_content, 'API_HOST', False)

    file_w = open(config_file_path, 'w')
    file_w.write(script_content)
    file_w.close()

def walk_oss(local_dir, context):
    access_key_id = OSS_AK
    access_key_secret = OSS_SK
    bucket_name = OSS_STORE_BUCKET
    endpoint = OSS_ENDPOINT

    bucket = oss2.Bucket(oss2.Auth(access_key_id, access_key_secret), endpoint, bucket_name)

    def handle_oss_file(path):
        key = context + '/' + path[len(local_dir):].replace('\\','/')
        key = key.replace('//','/')
        print("oss-upload:"+key+" -> "+path)

        with open(path, 'rb' ) as f:
            bucket.put_object(key, f)
        return

    return walk_dir(local_dir, handle_oss_file, [])

def walk_dir(path, func, resultArray):
    if func == None:
        return;

    if resultArray == None:
        resultArray = [];

    if os.path.isdir(path):
        filelist = os.listdir(path)
        for file in filelist:
            ##filter .*
            if not file.startswith('.'):
                childpath = os.path.join(path, file)
                walk_dir(childpath, func, resultArray)
    else:
        result = func(path);
        if result != None:
            ##print("append:"+path)
            resultArray.append(result)

    return resultArray

def upload_dist_oss():
    local_path = workspace + DIST_DIR_PATH
    walk_oss(local_path, get_wdy_env_context())

def copy_to_arhive_folder():
    src_path = workspace + DIST_DIR_PATH
    dest_path = archiveBasePath + '/' + env + '/' + version

    if(os.path.exists(dest_path)):
        shutil.rmtree(dest_path)

    shutil.copytree(src_path, dest_path)


if __name__ == '__main__':
    opts, args = getopt.getopt(sys.argv[1:], shortopts='', longopts=["mode=","workspace=","version=","env=","arpath="])

    for op, value in opts:
        if op == "--mode":
            CIMode = value
        elif op == "--workspace":
            workspace = value
        elif op == "--version":
            version = value
        elif op == '--env':
            env = value
        elif op == '--arpath':
            archiveBasePath = value

    # change config file
    if CIMode == 'changecfg':
        change_index_js()
        change_env_js()
    elif CIMode == 'upload':
        upload_dist_oss()
    elif CIMode == 'archive':
        copy_to_arhive_folder()