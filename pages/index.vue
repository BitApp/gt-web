<template>
  <div class="gt-body">
    <b-alert
      :variant="variant"
      fade
      :show="dismissCountDown"
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChanged"
    >
      <div>{{alertText}}</div>
      <div class="mt-2" v-if="faileddes != ''">
        {{faileddes.message||faileddes}}
      </div>
    </b-alert>
    <div class="gt-web-index clearfix">
      <div class="notice">
        <img class="mr-1 va-m" width="15" src="~assets/imgs/icon_notice.svg">
        <span class="va-m">本节点决定于 2020 年 12 月 1 日起正式退出 IOST 节点合伙人，2020 年 12 月 1 日正式退出后，XG 挖矿和投票双挖将会同时停止。[详情见公告]</span>
      </div>
      <!-- <div class="fr">
        <b-form-select v-model="language" :options="langs" @change="changeLang"></b-form-select>
      </div> -->
      <b-tabs pills class="mt-20">
        <!-- <b-tab title="投票双挖" :active="tab==='1'" @click="tabChange(1)">
          <div class="vote-web-view">
            <div class="banner-bg mt-10">
              <div class="banner">
                <div class="title">清风链游公会权益积分 GT（GUILD_TOKEN)</div>
                <div class="banner-content d-flex">
                  <div class="banner-content-left">
                    <div class="mt-8">
                      <div>1. 总量 2.1亿 / 2. 超级回购计划</div>
                      <div>3. 每年减半 / 4. 可随时兑换 IOST</div>
                      <div>5. 持有积分每月空投IOST</div>
                      <div>6. 积分商城已上线</div>
                    </div>
                  </div>
                  <img class="icon-gt" src="~/assets/imgs/icon_gt.svg" width="75">
                </div>
              </div>
            </div>
            <div class="countdown mt-15">
              <div class="countdown-content d-flex">
                <div>产量减半倒计时：</div>
                <no-ssr>
                <countdown class="number" :time="(nextHalve-currentBlock) * 500">
                  <template slot-scope="props">{{ props.days }} 天{{ props.hours }} 小时{{ props.minutes }} 分{{ props.seconds }} 秒</template>
                </countdown>
                </no-ssr>
              </div>
            </div>
            <div class="mt-15 info-view">
              <div class="info-line d-flex space-between">
                <div>
                  我的IOST：{{fixedNumber(accountInfo.balance,6)}}
                </div>
                <b-btn variant="link" size="sm" @click="voteNumber = fixedNumber(accountInfo.balance, 2)">全部</b-btn>
              </div>
              <div class="info-line">投票中的IOST：{{votebalances}}</div>
              <div class="frozen-line">
                <span>冻结中的IOST：{{frozenbalances}}</span>
                <b-link @click="unvoteModal">马上赎回</b-link>
              </div>
            </div>
            <div class="exchange-info mt-20">
              <div class="icon-view">
                <img class="icon-img" src="@/assets/imgs/icon_token.svg">
                <img class="icon-to" src="@/assets/imgs/icon_to.svg">
                <img class="icon-img" src="@/assets/imgs/icon_gt.svg">
              </div>
              <div class="font-norwester fs-20 scale-title mt-20">
                1 GT = {{gtPrice}} IOST
              </div>
              <div class="scale-desc">
                投票给[清风链游公会节点]即可免费获得 GT
                <br>
                <span style="color:#43ac64">可在原有IOST staking 的收益基础上，额外获得GT收益</span>
              </div>
              <b-input-group>
                <b-form-input type="number" v-model="voteNumber" placeholder="请输入投票数量" autocomplete="off"></b-form-input>
                <b-btn class="mt-20" block size="lg" variant="primary" @click="vote">投票</b-btn>
              </b-input-group>
              <div style="padding:10px">
                <div class="scale-tip">当前[清风链游公会节点]总票数{{'\xa0'+parseInt(producerVotes) + '\xa0'}}, 投 {{'\xa0'+(voteNumber || 0)+'\xa0'}} IOST 给公会节点，每天可额外分得 {{'\xa0'+fixedNumber(gtNumber) + '\xa0'}} GT = {{'\xa0'+fixedNumber(iostNumber,6) + '\xa0'}} IOST </div> 
              </div>
            </div>
            <div>
              <p class="mt-20">说明:</p>
              <p class="mt-10">1. 清风链游公会权益积分 GUILD_TOKEN，简称GT总发行量2.1亿</p>
              <p>2. 每天固定挖出5万Token，按照投票用户的投票占节点总得票数的比例分得</p>
              <p>3. 每过一年，日产量将减少为之前的一半</p>
              <p>4. 清风链游公会官方将每月固定配发5万IOST以{{gtPrice}} IOST/GT 的汇率回购GT代币（未来视节点票数而定，回购金额及回购汇率会有所增加）</p>
              <p>5. 持有积分余额大于1000的用户, 可每月按比例额外获得IOST空投, 空投时间为每月10号</p>
              <p>6. 清风链游公会积分商城已上线，大家可以使用GT兑换商城里的任意物品，包括实物和虚拟物品等</p>
              <p>7. 本活动最终解释权归清风链游公会所有</p>
            </div>
          </div>
        </b-tab> -->
        <b-tab title="积分兑换" :active="tab==='2'" @click="tabChange(2)">
          <div class="exchange-web-view mt-20">
            <div class="banner-bg mt-10">
              <div class="banner">
                <div class="title">清风链游公会权益积分 GT（GUILD_TOKEN)</div>
                <div class="banner-content d-flex">
                  <div class="banner-content-left">
                    <div class="mt-8">
                      <div>1. 总量 2.1亿 / 2. 超级回购计划</div>
                      <div>3. 每年减半 / 4. 可随时兑换 IOST</div>
                      <div>5. 持有积分每月空投IOST</div>
                      <div>6. 积分商城已上线</div>
                    </div>
                  </div>
                  <img class="icon-gt" src="~/assets/imgs/icon_gt.svg" width="75">
                </div>
              </div>
            </div>
            <div class="exchange-tip">
              <div class="abct-text d-flex">
                <div class="fb">
                  我的GT：{{tokenbalance}}
                </div>
                <div>
                  <b-btn variant="link" size="sm" @click="exchangeNumber = tokenbalance">全部</b-btn>
                </div>
              </div>
              <div class="exchange-pool">
                <b-input-group>
                  <b-form-input focus type="number" min=1 v-model="exchangeNumber" step="1" placeholder="请输入兑换数量" autocomplete="off"></b-form-input>
                  <b-input-group-text><strong>{{gtPrice}} IOST / GT</strong></b-input-group-text>
                </b-input-group>
                <div class="mt-20">
                  <b-btn block size="lg" variant="primary" @click="exchange">兑换</b-btn>
                </div>
                <div class="mt-15">
                  <b-btn variant="link" @click="historyModal">查看兑换记录 ></b-btn>
                </div>
              </div>
              <div class="exchange-pool mt-15">
                <span>兑换资金池：{{fixedNumber(contractBalance.balance,2)+ '\xa0 IOST'}}  </span>
                <img class="icon_largerise" src="~/assets/imgs/icon_largerise2.svg">
              </div>
              <div class="mt-10 c-light">2020年12月1日正式开展回购工作，届时将会一次性为兑换资金池冲入一笔回购资金，回购汇率0.066IOST，回购截止日期：2020年12月31日</div>
              <div class="exchange-pool mt-15">
                <span>总兑换：{{fixedNumber(totalExchange, 2)+ '\xa0 GT' + '\xa0 = \xa0' + fixedNumber(totalExchange * gtPrice,2) + '\xa0 IOST'}}  </span>
              </div>
            </div>
          </div>
          <HistoryModal ref="historyModal" />
          <ExchangeModal ref="exchangeModal" />
          <CMExchangeModal ref="cmExchangeModal"/>
          <CMOpenModal ref="cmOpenModal"/>
          <UnVoteModal ref="unvoteModal" @unVote="unvoteTip" />
        </b-tab>
        <!-- <b-tab title="积分商城" :active="tab==='3'" @click="tabChange(3)">
          <ul class="mall-web-view mt-20">
            <li v-for="(item, index) in productList.slice(0, 2)" :key="index" @click="() => { go(item) }">
              <div>
                <img :src="item.imgs[0]" alt="">
              </div>
              <div class="text-panel">
                <div class="prod-name">{{item.name}}</div>
                <div class="payment">{{item.price}} {{tokenHash[item.token]}}</div>
              </div>
            </li>
          </ul>
          <ul class="mall-web-view">
            <li v-for="(item, index) in productList.slice(2, 4)" :key="index" @click="() => { go(item) }">
              <div>
                <img :src="item.imgs[0]" alt="">
              </div>
              <div class="text-panel">
                <div class="prod-name">{{item.name}}</div>
                <div class="payment">{{item.price}} {{tokenHash[item.token]}}</div>
              </div>
            </li>
          </ul>
          <ul class="mall-web-view">
            <li v-for="(item, index) in productList.slice(4, 6)" :key="index" @click="() => { go(item) }">
              <div>
                <img :src="item.imgs[0]" alt="">
              </div>
              <div class="text-panel">
                <div class="prod-name">{{item.name}}</div>
                <div class="payment">{{item.price}} {{tokenHash[item.token]}}</div>
              </div>
            </li>
          </ul>
          <ul class="mall-web-view">
            <li v-for="(item, index) in productList.slice(6, 8)" :key="index" @click="() => { go(item) }">
              <div>
                <img :src="item.imgs[0]" alt="">
              </div>
              <div class="text-panel">
                <div class="prod-name">{{item.name}}</div>
                <div class="payment">{{item.price}} {{tokenHash[item.token]}}</div>
              </div>
            </li>
          </ul>
          <ul class="mall-web-view">
            <li v-for="(item, index) in productList.slice(8, 10)" :key="index" @click="() => { go(item) }">
              <div>
                <img :src="item.imgs[0]" alt="">
              </div>
              <div class="text-panel">
                <div class="prod-name">{{item.name}}</div>
                <div class="payment">{{item.price}} {{tokenHash[item.token]}}</div>
              </div>
            </li>
          </ul>
          <ul class="mall-web-view">
            <li v-for="(item, index) in productList.slice(10, 12)" :key="index" @click="() => { go(item) }">
              <div>
                <img :src="item.imgs[0]" alt="">
              </div>
              <div class="text-panel">
                <div class="prod-name">{{item.name}}</div>
                <div class="payment">{{item.price}} {{tokenHash[item.token]}}</div>
              </div>
            </li>
          </ul>
          <ul class="mall-web-view">
            <li v-for="(item, index) in productList.slice(12, 14)" :key="index" @click="() => { go(item) }">
              <div>
                <img :src="item.imgs[0]" alt="">
              </div>
              <div class="text-panel">
                <div class="prod-name">{{item.name}}</div>
                <div class="payment">{{item.price}} {{tokenHash[item.token]}}</div>
              </div>
            </li>
          </ul>
          <ul class="mall-web-view">
            <li v-for="(item, index) in productList.slice(14, 16)" :key="index" @click="() => { go(item) }">
              <div>
                <img :src="item.imgs[0]" alt="">
              </div>
              <div class="text-panel">
                <div class="prod-name">{{item.name}}</div>
                <div class="payment">{{item.price}} {{tokenHash[item.token]}}</div>
              </div>
            </li>
          </ul>
          <p class="mt-20 ta-c">
            更多商品正在接入
          </p>
          <div class="mt-15 ta-c">
            <b-btn variant="link" @click="exchangeModal">我的兑换记录 ></b-btn>
          </div>
        </b-tab> -->
        <b-tab title="往期公告" :active="tab==='4'" @click="tabChange(4)">
          <div class="banner-bg mt-20">
              <div class="banner">
                <div class="title">往期公告</div>
                  <div class="notice">
                    <div class="mb-10 mt-10">
                      <img class="mr-1 va-m" width="15" src="~assets/imgs/icon_notice.svg">
                      <span class="va-m">
                        <span class="c-light mr-1">[2020-11-27]</span>
                        “清风链游公会”退出 IOST 节点告知书
                        <br>
                        <br>
                        “清风链游公会”为 IOST 链上合伙人节点，2019Q3、Q4、
                        2020Q1 及 Q2 第二梯队，Q3 第三梯队。
                        <br>
                        <br>
                        由于近期发生在 IOST 身上的“官方未通过社群投票表决取消了投票帐户的 staking 季度奖励”、“对已发行的链上代币 husd 进行强制重置使用权限”事件，本节点持坚决 反对态度，通过上述事件也体现出了 IOST 官方拥有极度中心化的权限，这不符合区块 链精神。故本节点决定于 2020 年 12 月 1 日起正式退出 IOST 节点合伙人。
                        <br>
                        1、官方未通过社群投票表决取消了投票帐户的 staking 季度奖励事件，节点看法是 IOST 官方在年中就已经公开宣传并实施了社群自治投票机制，对于这种重大事件(涉及 大部分参与 staking 的用户)的改动，应当通过投票表决，而不是官方一言堂决定。
                        <br>
                        2、对已发行的链上代币 husd 进行强制重置使用权限事件，IOST 官方宣称联系 husd 账号主人两个月未收到反馈，决定强制重置其账号对husd的使用权限并给予10万IOST 补偿奖励(时价约 3,540 元人民币)，这是奖励?这应该是赔偿(你这意思是你抢了人 家东西，人家还得谢谢你)。即便是为了 IOST 整体利益的考虑，但此做法是否太过于霸 道，且极度中心化的权限。举个极端例子，那是否在 IOST 主网上的所有项目代币，IOST 官方其实都有权限可以重置或决定归属。A 用户提前注册了商标，B 用户需要使用此商 标，那也只能双方协商解决，A 用户不愿意出售或无回复，B 就可以通过有关部门(此 处举例 IOST 官方)强行获得 A 名下的商标使用权限吗?这个权限意思就是，比如 IOST 链上如果有一个市值很大的项目，如果 IOST 官方想作恶，可以直接把这个项目的代币 权限转到自己名下，强行霸占此项目。IOST 对外宣传比 EOS 更去中心化，看起来这就是 最中心化的表现，与现实机构相比更要中心化到极致。(文末附官方截图)
                        对于已通过 staking 投票免费挖出的 gt(guild_token)积分，初衷是为了使投票者获 得更多的收益，未进行兑换的节点将以 0.066IOST 的单价进行回收，回收截止 2020 年 12 月 31 日，回收方式:通过 TokenPocket 钱包搜索“清风链游公会”，选择积分兑换界 面进行兑换。
                        2020 年 12 月 1 日正式退出后，XG 挖矿和投票双挖将会同时停止。
                        <br>
                        <img class="w100p mt-10" src="~assets/imgs/report.png"/>
                      </span>
                    </div>
                     <div class="mb-10 mt-10">
                      <img class="mr-1 va-m" width="15" src="~assets/imgs/icon_notice.svg">
                      <span class="va-m">
                        <span class="c-light mr-1">[2020-11-10]</span>
                        持有GT空投IOST第三期奖励已发放，本次空投比例1000GT：16.28IOST
                      </span>
                    </div>
                    <div class="mb-10 mt-10">
                      <img class="mr-1 va-m" width="15" src="~assets/imgs/icon_notice.svg">
                      <span class="va-m">
                        <span class="c-light mr-1">[2020-11-10]</span>
                        GUILD_TOKEN 回购兑换池第九次回冲已完成，本次回购额度 50000 IOST 。
                      </span>
                    </div>
                    <div class="mb-10 mt-10">
                      <img class="mr-1 va-m" width="15" src="~assets/imgs/icon_notice.svg">
                      <span class="va-m">
                        <span class="c-light mr-1">[2020-10-28]</span>
                        <span>积分已上线西瓜平台</span>
                        <br/>
                        将于2020/10/28晚11点开矿(XG)，在tp钱包“发现”输入地址“app.xigua.ist”访问
                        <br/>
                        <br/>
                        已同步开通两个交易对：
                        <br/>
                        guild_token/iost
                        <br/>
                        guild_token/xusd
                        <br/>
                        以上两个交易对都可进行交易及做市
                        <br/>
                        <br/>
                        在西瓜挖矿上线后，为积分交易对进行做市可同步参与西瓜挖矿
                        <br/>
                        支持西瓜挖矿的交易对：guild_token/xusd
                        <br/>
                      </span>
                    </div>
                    <div class="mb-10 mt-10">
                      <img class="mr-1 va-m" width="15" src="~assets/imgs/icon_notice.svg">
                      <span class="va-m">
                        <span class="c-light mr-1">[2020-10-10]</span>
                        持有GT空投IOST第二期奖励已发放，本次空投比例1000GT：16.28IOST
                      </span>
                    </div>
                    <div class="mb-10 mt-10">
                      <img class="mr-1 va-m" width="15" src="~assets/imgs/icon_notice.svg">
                      <span class="va-m">
                        <span class="c-light mr-1">[2020-10-10]</span>
                        GUILD_TOKEN 回购兑换池第八次回冲已完成，本次回购额度 50000 IOST 。
                      </span>
                    </div>
                    <div class="mb-10 mt-10">
                      <img class="mr-1 va-m" width="15" src="~assets/imgs/icon_notice.svg">
                      <span class="va-m">
                        <span class="c-light mr-1">[2020-09-10]</span>
                        首期持有GT空投IOST奖励已发放，本次空投比例1000GT：12.88IOST 。
                      </span>
                    </div>
                    <div class="mb-10 mt-10">
                      <img class="mr-1 va-m" width="15" src="~assets/imgs/icon_notice.svg">
                      <span class="va-m">
                        <span class="c-light mr-1">[2020-09-10]</span>
                        GUILD_TOKEN 回购兑换池第七次回冲已完成，本次回购额度 50000 IOST 。
                      </span>
                    </div>
                    <div class="mb-10 mt-10">
                      <img class="mr-1 va-m" width="15" src="~assets/imgs/icon_notice.svg">
                      <span class="va-m">
                        <span class="c-light mr-1">[2020-08-10]</span>
                        GUILD_TOKEN 回购兑换池第六次回冲已完成，本次回购额度 50000 IOST 。
                      </span>
                    </div>
                    <div class="mb-10 mt-10">
                      <img class="mr-1 va-m" width="15" src="~assets/imgs/icon_notice.svg">
                      <span class="va-m">
                        <span class="c-light mr-1">[2020-07-10]</span>
                        GUILD_TOKEN 回购兑换池第五次回冲已完成，本次回购额度 50000 IOST 。
                      </span>
                    </div>
                    <div class="mb-10 mt-10">
                      <img class="mr-1 va-m" width="15" src="~assets/imgs/icon_notice.svg">
                      <span class="va-m">
                        <span class="c-light mr-1">[2020-06-27]</span>
                        投票双挖产出的GT（guild_token）已上线IOSTDEX可挂单交易，通过TokenPocket钱包搜索IOSTDEX即可访问！
                      </span>
                    </div>
                    <div class="mb-10 mt-10">
                      <img class="mr-1 va-m" width="15" src="~assets/imgs/icon_notice.svg">
                      <span class="va-m">
                        <span class="c-light mr-1">[2020-06-10]</span>
                        GUILD_TOKEN 回购兑换池第四次回冲已完成，本次回购额度 50000 IOST 。
                      </span>
                    </div>
                    <div class="mb-10 mt-10">
                      <img class="mr-1 va-m" width="15" src="~assets/imgs/icon_notice.svg">
                      <span class="va-m">
                        <span class="c-light mr-1">[2020-05-10]</span>GUILD_TOKEN 回购兑换池第三次回冲已完成，本次回购额度 50000 IOST 。
                      </span>
                    </div>
                    <div class="mb-10 mt-10">
                      <img class="mr-1 va-m" width="15" src="~assets/imgs/icon_notice.svg">
                      <span class="va-m">
                        <span class="c-light mr-1">[2020-05-05]</span>清风链游公会GT积分商城正式上线，更多好礼正在接入，欢迎大家体验及合作 。
                      </span>
                    </div>
                    <div class="mb-10 mt-10">
                      <img class="mr-1 va-m" width="15" src="~assets/imgs/icon_notice.svg">
                      <span class="va-m">
                        <span class="c-light mr-1">[2020-04-10]</span>GUILD_TOKEN 回购兑换池第二次回冲已完成，本次回购额度 50000 IOST 。
                      </span>
                    </div>
                    <div class="mb-10 mt-10">
                      <img class="mr-1 va-m" width="15" src="~assets/imgs/icon_notice.svg">
                      <span class="va-m">
                        <span class="c-light mr-1">[2020-03-10]</span>GUILD_TOKEN 回购兑换池第一次回冲已完成，本次回购额度 50000 IOST 。
                      </span>
                    </div>
                  </div>
                </div>
            </div>
        </b-tab>
        <!-- <b-tab title="积分夺宝" v-if="cmList.length" :active="tab==='4'" @click="tabChange(4)">
          <div class="prod-content mt-20">
            <div>
              <img src="/imgs/iost.jpg" alt="">
            </div>
            <div class="text-panel">
              <div class="prod-name">IOST x 1888 枚</div>
              <div class="price">
                <span class="label">价格: </span>
                <span class="value">{{cmList[cmIndex].price}} {{tokenHash[cmList[cmIndex].token]}}</span>
              </div>
              <div class="countdown-wrapper">
                <span class="label">开奖倒计时: </span>
                <VueCountdown v-if="cmList[cmIndex].lastOpenTime + cmList[cmIndex].timeStep > Date.now()"
                 class="value" :time="cmList[cmIndex].lastOpenTime + cmList[cmIndex].timeStep - Date.now()">
                  <template slot-scope="props" style="font-size:12px">{{ props.days }} 天{{ props.hours }} 小时{{ props.minutes }} 分{{ props.seconds }} 秒</template>
                </VueCountdown>
                <span style="color:#8E8E8E;font-size:12px;" v-else-if="cmList[cmIndex].lastOpenTime + cmList[cmIndex].timeStep <= Date.now()
                   && cmList[cmIndex].serialNumber < cmList[cmIndex].copiesNumber">超过72小时，等待奖池满30000GT</span>
                <span style="color:#8E8E8E;font-size:12px" v-else>已开奖</span>
              </div>
              <div class="progress-wrapper mt-20">
                <b-progress :max="cmList[cmIndex].copiesNumber * cmList[cmIndex].price">
                  <b-progress-bar :value="cmList[cmIndex].serialNumber * cmList[cmIndex].price" :label="`${((cmList[cmIndex].serialNumber / cmList[cmIndex].copiesNumber) * 100).toFixed(2)}%`"></b-progress-bar>
                </b-progress>
              </div>
              <div class="inventory  mt-20">
                <span class="label">期数: </span>
                <span class="value">{{cmList.length ? cmList[cmIndex].coinMoreNumber : "-"}}</span>
              </div>
              <div class="sep"></div>
              <p class="desc">
                每次参与消耗200GT，单个地址同期最多参与5000GT，活动长期有效，最快3天一期
                <br>
                <br>
                <span class="fb">开奖规则</span>
                <br>
                满30000GT，72小时后开奖
                <br>
                未满30000GT，超过72小时后满30000GT开奖
              </p>
            </div>
            <div class="button-panel">
              <b-btn class="mt-20 btn-exhange" block size="lg" variant="primary" @click="coinMore">兑换</b-btn>
            </div>
          </div>
          <div class="mt-15 ta-c">
            <b-btn variant="link" @click="openCMExchangeModel">查看参与记录 ></b-btn>
            <b-btn variant="link" @click="openCMOpenModel">查看往期记录 ></b-btn>
          </div>
        </b-tab> -->
      </b-tabs>
      <b-modal ref="statusModal" >
        <div style="color:#000;">{{modalText}}</div>
        <div style="color:#721c24">{{txMessage}}</div>
        <template slot="modal-footer" slot-scope="{cancel}">
          <b-button v-if="txhash != ''" size="sm" variant="info" @click="toTxHash">
            查看交易结果
          </b-button>
          <b-button size="sm" @click="cancel()">
            Cancel
          </b-button>
        </template>
      </b-modal>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import IOST from 'iost'
import DiffLabel from '~/components/DiffLabel'
import HistoryModal from '~/components/HistoryModal'
import ExchangeModal from '~/components/ExchangeModal'
import CMExchangeModal from '~/components/CMExchangeModel'
import CMOpenModal from '~/components/CMOpenModal'
import VueCountdown from '@chenfengyuan/vue-countdown'
import TipsModal from '~/components/TipsModal'
import UnVoteModal from '~/components/UnVoteModal'
import { mapState } from "vuex"
import cookies from "~/plugins/cookies"
import {contract, gtPrice, nodeAddr, DAY_MAX} from "~/plugins/variables"

export default {
  components: {
    DiffLabel,
    TipsModal,
    HistoryModal,
    ExchangeModal,
    CMExchangeModal,
    CMOpenModal,
    UnVoteModal,
    VueCountdown
  },
  computed:{
    ...mapState(["lang"]),
  },
  data () {
    return {
      tab: 1,
      voteNumber:'',
      gtNumber: '',
      alertText: '',
      faileddes:'',
      dismissSecs: 5,
      dismissCountDown: 0,
      variant: 'danger',
      gtPrice,
      nodeAddr,
      dayGT: 50000,
      iostNumber: 0,
      walletAccount:'',
      contractBalance:{},
      productList: [],
      cmIndex: 0,
      cmList: [],
      accountInfo:{},
      producerVotes: 0,
      tokenbalance:0,
      iostbalance: 0,
      votebalances:0,
      frozenbalances:0,
      navigator:{},
      exchangeNumber: 0,
      isloading: false,
      tokenHash: {
        "guild_token": "GT",
        "iost": "IOST"
      },
      txhash:'',
      txMessage: '',
      modalText:'',
      language:'zh_Hans_CN',

      currentBlock: 0,
      nextHalve: 0,
      totalExchange: 0,
      ref:'',
      langs:[
        {value:"en_US",text:'English'},
        {value:"zh_Hans_CN",text:'简体中文'},
        {value:"zh_Hant_HK",text:'繁體中文'},
      ]
    }
  },
  async asyncData({ req, app, query, $axios }) {
    return {
      tab: query.tab
    }
  },
  head() {
    return {
      title: 'GUILD_TOKEN',
      ip: null,
    }
  },
  mounted(){
    this.initIwallet()
    //资金池
    this.$common.getContractBalance().then( res =>{
      this.contractBalance = res
    })
    this.$common.getProducerInfo(nodeAddr).then( res => {
      this.producerVotes = res.votes
    })
    this.$common.getProductList().then( res => {
      this.productList = res.data;
    })
    this.$common.getCoinMoreList().then( res => {
      this.cmList = res.data
    })
    this.getContractInfo();
    this.navigator = window.navigator

    this.ref = this.$route.query.ref || window.sessionStorage.getItem('ref') || ''
    window.sessionStorage.setItem('ref',this.ref)
    this.language = /cn/i.test(this.lang.lang)? 'zh_Hans_CN':/en/i.test(this.lang.lang)?'en_US':'zh_Hant_HK'
  },  
  methods:{
    //账户信息
    getContractInfo(){
      this.$rpc.blockchain.getContractStorage(contract, "HALVE_BLOCK", true).then(data => {
        this.nextHalve = data.data
        this.currentBlock = data.block_number
      })

      this.$rpc.blockchain.getContractStorage(contract, "TOTAL_EXCHANGE", true).then(data => {
        this.totalExchange = data.data || 0
      })
    },
    getAccountInfo () {
      this.$rpc.blockchain.getAccountInfo(this.walletAccount,true).then(account => {
        this.accountInfo = account
        this.votebalances= account.vote_infos.reduce((reduced, vote) => vote.votes ? reduced + vote.votes : 0, 0)
        this.frozenbalances =  account.frozen_balances.reduce((reduced,frozen) => frozen.amount ? reduced+frozen.amount:0,0)
      })
    },
    toTxHash(){
      if (this.txhash) {
        window.location = `https://www.iostabc.com/tx/${this.txhash}`
      }
    },
    unvoteTip(data){
      if (data.message) {
        this.txMessage = data.message
      }
      this.modalText = data.text
      this.txhash = data.txhash
      this.$refs.statusModal.show()
    },

    changeLang(item){
      const date = new Date();
      const expire = new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000);
      cookies.setItem(document, "lang", item, expire, "/");
      location.href = location.origin
    },

    historyModal(type){
      this.$refs['historyModal'].showModal(type)
    },

    exchangeModal(){
      this.$refs['exchangeModal'].showModal()
    },

    openCMExchangeModel(){
      this.$refs['cmExchangeModal'].showModal()
    },

    openCMOpenModel(){
      this.$refs['cmOpenModal'].showModal()
    },

    initIwallet(){
      const _this = this
      var timeInterval = setInterval(() => {
        if (window.IWalletJS) { 
          window.IWalletJS.enable().then((account) => {
          if(!account) {
            _this.walletAccount = null
          } else {
            clearInterval(timeInterval)
            _this.walletAccount = account
            _this.$store.commit('setWalletAccount', account) 
            _this.getAccountInfo()
            _this.$common.getTokenBalance(account, "guild_token").then( res =>{
              _this.tokenbalance = res.balance
            })
            _this.$common.getTokenBalance(account, "iost").then( res =>{
              _this.iostbalance = res.balance
            })
          }
        })
        }
      }, 1000);
    },
    fixedNumber(numbers,fixed){
      fixed = fixed || 2
      if (!numbers) {
        return 0
      }
      let number = new Number(numbers)
      number = number.toFixed(10)
      let str = "^(.*\\..{" + fixed + "}).*$" 
      number = String(number).replace( new RegExp(str),"$1")
      number = Number(number)
      return number
    },

    exchange () {
      this.exchangeNumber = this.fixedNumber(this.exchangeNumber, 0)
      if (this.exchangeNumber > this.tokenbalance) {
        alert("GT余额不足")
      } else {
        if(this.exchangeNumber> 0 && confirm(`确定兑换${this.exchangeNumber} GT ≈ ${this.fixedNumber(this.exchangeNumber * gtPrice)} IOST吗？`)){
          if (this.fixedNumber(this.exchangeNumber * gtPrice) > this.fixedNumber(this.contractBalance.balance,2)) {
            alert("兑换资金池余额不足, 你最多可兑换" + this.fixedNumber(this.fixedNumber(this.contractBalance.balance, 2) / gtPrice, 2) + " GT")
          } else {
            const iost = IWalletJS.newIOST(IOST)
            const ctx = iost.callABI(contract, "exchange", [this.walletAccount, this.exchangeNumber.toString()])
            ctx.addApprove("guild_token", this.exchangeNumber.toString());
            ctx.gasLimit = 300000
            const _this = this
            iost.signAndSend(ctx).on('pending', (trx) => {
              alert(_this.exchangeNumber + "GT 兑换完成，请等待交易确认")
              _this.exchangeNumber = 0
            })
            .on('success', (result) => {
              // alert(`兑换${this.exchangeNumber}GT≈${this.fixedNumber(this.exchangeNumber * 0.066)}GT成功`)
            })
            .on('failed', (failed) => {
              alert("兑换失败")
            })
          }
        }
      }
    },

    coinMore () {
      const prod = this.cmList[this.cmIndex];
      if (prod.token  === "guild_token") {
        if (prod.price > this.tokenbalance) {
          alert("GT余额不足")
          return
        }
      } else if(prod.token  === "iost") {
        if (prod.price > this.iostbalance) {
          alert("IOST余额不足")
          return
        }
      }
      if(confirm(`确定参与IOST积分夺宝吗？`)){
        const iost = IWalletJS.newIOST(IOST)
        const ctx = iost.callABI(contract, "coinMore", [prod.pId])
        ctx.gasLimit = 300000
        ctx.addApprove(prod.token, prod.price.toString());
        const _this = this
        iost.signAndSend(ctx).on('pending', (trx) => {
          alert("夺宝成功，请等待交易确认")
        })
        .on('success', (result) => {
          // alert(`兑换${this.exchangeNumber}GT≈${this.fixedNumber(this.exchangeNumber * 0.066)}GT成功`)
        })
        .on('failed', (failed) => {
          alert("夺宝失败")
        })
      }
    },

    go (prod){
      this.$router.push('/exchange/' + prod.pId)
    },

    tabChange (tab) {
      this.$router.push('/?tab=' + tab)
    },

    vote(){
      let tmpvoteNumber = this.voteNumber || 0
      if (tmpvoteNumber <= 0) {
        this.variant = 'danger'
        this.alertText = '投票数量不能小于0'
        this.dismissCountDown = this.dismissSecs
        return
      } 
      if (tmpvoteNumber > this.accountInfo.balance) {
        this.variant = 'danger'
        this.alertText = '投票数量超过可使用余额'
        this.dismissCountDown = this.dismissSecs
        return
      }
      this.isshowModal = false
      this.modalText = `投票已完成，投给[清风链游公会节点] ${'\xa0'+tmpvoteNumber+'\xa0'}票，按当前节点总票数，每天会分得${'\xa0'+ this.fixedNumber(this.gtNumber, 2)+'\xa0'} GT`
      this.txMessage = ''
      const iost = IWalletJS.newIOST(IOST)
      const ctx = iost.callABI('vote_producer.iost', "vote", [this.walletAccount, nodeAddr,tmpvoteNumber.toString()])
      ctx.gasLimit = 300000
      iost.signAndSend(ctx).on('pending', (trx) => {
        if (!this.isshowModal) {
          this.isshowModal = true
          this.txhash = trx
          this.voteNumber = ''
          this.$refs.statusModal.show()
        }
        // this.isloading = true
      })
      .on('success', (result) => {
        // this.isloading = false
        // this.variant = 'success'
        // this.alertText = '投票成功'
        // this.voteNumber = ''
        // this.getAccountInfo()
        // this.dismissCountDown = this.dismissSecs
        if (result.tx_hash) {
          this.getAccountInfo()
        }
        if (!this.isshowModal) {
          this.isshowModal = true
          this.txhash = result.tx_hash
          this.voteNumber = ''
          this.$refs.statusModal.show()
        }
      })
      .on('failed', (failed) => {
        // this.isloading = false
        if (/rejected/i.test(failed)) {
          return
        }
        if (!this.isshowModal) {
          this.isshowModal = true
          this.modalText = '投票失败'
          this.txhash = failed.tx_hash?failed.tx_hash:''
          this.txMessage = JSON.stringify(failed)
          this.$refs.statusModal.show()
        }
        // this.variant = 'danger'
        // this.alertText = '投票失败'
        // this.faileddes = failed
        // this.dismissCountDown = this.dismissSecs
      })
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    unvoteModal(){
      this.$refs['unvoteModal'].showModal()
    }
  },

  watch: {
    voteNumber: function () {
      this.gtNumber = Math.min(DAY_MAX, ((this.voteNumber || 0) / parseInt(this.producerVotes*1 + this.voteNumber * 1)) * this.dayGT)
      this.iostNumber = this.gtNumber * gtPrice
    }
  },
  
  beforeDestroy(){
    clearInterval()
  }
}
</script>

<style lang="scss" scoped>
.gt-body{
  padding: 0 calc(50% - 280px);
  min-width: 350px;
  font-size: 14px;
  
  .gt-web-index {
    .notice{
      background:rgba(42,54,87,1);
      border-radius: 10px;
      padding: 10px 15px;
      color: white;
    }
    padding: 30px 20px;
    .mt-8 {
      margin-top: 8px;
    }
    .mt-20 {
      margin-top: 20px;
    }
    .banner{
      border-radius: 8px;
      background: #2A3657;
      .title {
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        background: #39AFFF;
        color:white;
        padding: 10px;
        border-radius: 8px;
      }
      .banner-content {
        padding: 10px;
        align-items: center;
        height: 100%;
        .banner-content-left{
          margin-left:12px;
          flex: 1;
        }
      }
    }
    .vote-web-view{
      .info-view{
        padding: 15px;
        border-radius: 8px;
        background: #2A3657;
        .info-line{
          line-height: 25px;
        }
        .frozen-line{
          display: flex;
          justify-content: space-between;
        }
      }
      .exchange-info{
        padding: 15px;
        background: #2A3657;
        .c-gray{
          color: gray;
        }
        .icon-view{
          display: flex;
          justify-content: center;
          align-items: center;
          .icon-img{
            height: 40px;
          }
          .icon-to{
            margin: 0 10px;
            height: 15px;
          }
        }
        #price{
          display: inline-block;
          width: 140px;
        }
        .switch{
          margin-left:5px;
        }
        .scale-title{
          text-align: center;
        }
        .scale-desc{
          text-align: center;
          padding: 20px;
        }
        .scale-tip{
          line-height: 20px;
          color: rgba(255, 255, 255, 0.6);
        }
      }
      .mask-view{
        position: absolute;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.6);
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .exchange-web-view {
      .banner{
        border-radius: 8px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
      .exchange-tip{
        padding: 20px;
        border-radius: 8px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        background-color:#2A3657;
        .exchange-pool{
          .icon_largerise{
            height: 11px;
          }
          border-top: 1px solid rgb(63, 80, 126);
          padding-top: 10px;
        }
        .abct-text{
          justify-content: space-between;
          align-items: center;
        }
      }
    }
    .mall-web-view {
      display: flex;
      justify-content: space-around; 
      li {
        width: 160px;
        height: 170px;
        background: white;
        border-radius: 4px;
        margin-bottom: 20px;
        img {
          border-radius: 4px;
          width: 100%;
        }
        .text-panel {
          padding: 0 14px;
          font-size: 12px;
          margin-top: 4px;
          .prod-name, .payment {
            margin-top: 2px;
            overflow: hidden;
            height: 18px;
            line-height: 18px;
            text-overflow: ellipsis;
            white-space: nowrap;
            color :#3E3E3E;
          }
          .payment {
            color: #007bff;
          }
        }
      }
    }
    .prod-content {
      display: inline-block;
      margin-top: 10px;
      width: 100%;
      background: white;
      border-radius: 8px;
      padding-bottom: 20px;
      img {
        border-radius: 8px;
        width: 100%;
      }
      .text-panel {
        padding: 0 14px;
        margin-top: 4px;
        .prod-name, .price {
          margin-top: 2px;
          overflow: hidden;
          height: 28px;
          line-height: 28px;
          text-overflow: ellipsis;
          white-space: nowrap;
          color :#3E3E3E;
          margin-bottom: 10px;
        }
        .prod-name{
          font-size: 14px;
          font-weight: bold;
        }
        .price {
          display: flex;
          justify-content: space-between;
          .value {
            color: #007bff;
          }
        }
        .inventory {
          color: #3E3E3E;
          display: flex;
          justify-content: space-between;
          .value {
            color: #8E8E8E;
          }
        }
        .countdown-wrapper {
          color: #3E3E3E;
          display: flex;
          justify-content: space-between;
          .value {
            color:#007bff;
          }
        }
      }
      .sep {
        height: 1px;
        background: #F5F6F9;
        margin: 10px 0;
      }
      .desc {
        color:#8E8E8E;
      }
      .button-panel {
        padding: 0 14px;
      }
    }
  }
  
}
@media only screen and (max-width: 375px) {
  .gt-body {
    .gt-web-index {
      .mall-web-view {
        li {
          width: 140px;
          height: 154px;
        }
      }
    }
  }
}
</style>

